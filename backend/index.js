import { createServer } from "http";
import { Server } from "socket.io";
import { ObjectId } from "mongodb";
import * as db from "./db/mongo.js";
import * as game from "./utils/gameUtils.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

const DISCONNECT_DELAY_MS = 5000;

function isValidObjectId(id) {
    return typeof id === "string" && ObjectId.isValid(id);
}

function isValidDirection(value) {
    return typeof value === "boolean";
}

function isValidEnemiesArray(arr) {
    if (!Array.isArray(arr)) return false;
    return arr.every(
        (e) =>
            typeof e === "object" &&
            e !== null &&
            typeof e.type === "string" &&
            typeof e.x === "number" &&
            typeof e.y === "number" &&
            typeof e.health === "number"
    );
}

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || "http://localhost:5173" },
});

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        socket.isGuest = true;
        return next();
    }

    try {
        socket.user = jwt.verify(token, JWT_SECRET);
        socket.isGuest = false;
        next();
    } catch {
        // Stale or invalid token — treat as guest instead of rejecting
        socket.isGuest = true;
        next();
    }
});

const disconnectTimers = new Map();

io.on("connection", (socket) => {
    const updateCurrentJWT = (level) => {
        socket.user.currentLevel = level._id;
        const newToken = jwt.sign(socket.user, JWT_SECRET);
        socket.emit("assignToken", { token: newToken });
    };

    if (socket.isGuest) {
        const username = `user_${Math.random().toString(36).slice(2)}`;
        const guestToken = jwt.sign({ role: "guest", id: username }, JWT_SECRET);

        socket.emit("assignToken", { token: guestToken });
        socket.emit("assignUsername", { username });

        socket.user = jwt.verify(guestToken, JWT_SECRET);
        socket.isGuest = false;
    }

    // Cancel any pending disconnect cleanup for this user
    const existingTimer = disconnectTimers.get(socket.user.id);
    if (existingTimer) {
        existingTimer();
        disconnectTimers.delete(socket.user.id);
    }

    console.log("Player connected:", socket.user.id);

    function delay(ms, callback) {
        const timeoutId = setTimeout(callback, ms);
        return () => clearTimeout(timeoutId);
    }

    socket.on("nextLevel", async (currentId, right, enemies) => {
        try {
            if (!isValidObjectId(currentId)) {
                socket.emit("currentLevel", { error: "Invalid level ID" });
                return;
            }
            if (!isValidDirection(right)) {
                socket.emit("currentLevel", { error: "Invalid direction" });
                return;
            }
            if (!isValidEnemiesArray(enemies)) {
                socket.emit("currentLevel", { error: "Invalid enemies data" });
                return;
            }

            const level = await db.getLevelById(currentId);
            if (!level) {
                socket.emit("currentLevel", { error: "Level not found" });
                return;
            }
            level.enemies = enemies;
            await db.saveLevel(level);

            const directionKey = right ? "right" : "left";
            const oppositeKey = right ? "left" : "right";

            if (level[directionKey]) {
                const nextLevel = await db.getLevelById(level[directionKey]);
                if (nextLevel) {
                    socket.emit("currentLevel", { data: nextLevel });
                    return;
                }
            }

            // Create new level if none exists
            const newLevel = await game.createLevel(right);
            level[directionKey] = newLevel._id;
            newLevel[oppositeKey] = level._id;

            await Promise.all([db.saveLevel(level), db.saveLevel(newLevel)]);
            socket.emit("currentLevel", { data: newLevel });
        } catch (err) {
            console.error("Error transitioning to next level:", err);
            socket.emit("currentLevel", { error: "Failed to transition level" });
        }
    });

    socket.on("resetLevel", async () => {
        try {
            if (socket.user.currentLevel) {
                await game.deleteLevel(socket.user.currentLevel);
            }

            const level = await game.createLevel();
            level.enemies = [];
            await db.saveLevel(level);
            updateCurrentJWT(level);
            socket.emit("currentLevel", { data: level });
        } catch (err) {
            console.error("Error resetting level:", err);
            socket.emit("currentLevel", { error: "Failed to reset level" });
        }
    });

    socket.on("getLevel", async (id) => {
        try {
            if (id != null && !isValidObjectId(id)) {
                socket.emit("currentLevel", { error: "Invalid level ID" });
                return;
            }

            let level;
            if (!id) {
                if (socket.user.currentLevel) {
                    level = await db.getLevelById(socket.user.currentLevel);
                    if (!level) {
                        level = await game.createLevel();
                        level.enemies = [];
                        await db.saveLevel(level);
                        updateCurrentJWT(level);
                    }
                } else {
                    level = await game.createLevel();
                    level.enemies = [];
                    await db.saveLevel(level);
                    updateCurrentJWT(level);
                }
            } else {
                level = await db.getLevelById(id);
                if (!level) {
                    level = await game.createLevel();
                    level.enemies = [];
                }
            }
            socket.emit("currentLevel", { data: level });
        } catch (err) {
            console.error("Error getting/creating level:", err);
            socket.emit("currentLevel", { error: "Failed to get level" });
        }
    });

    socket.on("disconnect", () => {
        const cancelFn = delay(DISCONNECT_DELAY_MS, async () => {
            try {
                await game.deleteLevel(socket.user.currentLevel);
            } catch (err) {
                console.error("Error cleaning up level on disconnect:", err);
            }
            disconnectTimers.delete(socket.user.id);
        });
        disconnectTimers.set(socket.user.id, cancelFn);
        console.log("Player disconnected:", socket.user.id);
    });
});

const port = process.env.PORT || 5000;

// Connect to DB before accepting connections
db.connect()
    .then(() => {
        const server = httpServer.listen(port, () => {
            console.log("Socket.IO server running on ws://localhost:" + port);
        });

        // Graceful shutdown
        function shutdown(signal) {
            console.log(`${signal} received, shutting down gracefully...`);
            io.emit("serverShutdown", { message: "Server is restarting" });

            server.close(() => {
                db.close().then(() => {
                    console.log("Server shut down cleanly");
                    process.exit(0);
                }).catch(() => {
                    process.exit(1);
                });
            });

            setTimeout(() => {
                console.error("Forced shutdown after timeout");
                process.exit(1);
            }, 10000);
        }

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    });
