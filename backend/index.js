import { createServer } from "http";
import { Server } from "socket.io";
import * as db from "./db/mongo.js";
import * as game from "./utils/gameUtils.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

db.connect().catch(console.error);

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
        next(new Error("Invalid token"));
    }
});

let cancel;

io.on("connection", (socket) => {
    if(cancel) {
        cancel()
    }
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

    console.log("✅ Player connected:", socket.user.id);

    socket.on("updateLevel", (data) => {
        let updateLevelData = {};
        updateLevelData[socket.user.id] = data;
    });

    const handleLevelTransition = async (level, nextLevel) => {
        io.emit("currentLevel", { data: nextLevel });
    };
    const deleteLevel = async (levelId) => {
       await game.deleteLevel(levelId);
    };
    function delay(ms, callback) {
        const timeoutId = setTimeout(callback, ms);
        return () => clearTimeout(timeoutId); // return cancel function
    }


    socket.on("nextLevel", async (currentId, right, enemies) => {
        try {
            const level = await db.getLevelById(currentId);
            level.enemies = enemies;
            await db.saveLevel(level);

            const directionKey = right ? "right" : "left";
            const oppositeKey = right ? "left" : "right";

            if (level[directionKey]) {
                const nextLevel = await db.getLevelById(level[directionKey]);
                await handleLevelTransition(level, nextLevel);
                return;
            }

            // Create new level if none exists
            const newLevel = await game.createLevel(right);
            level[directionKey] = newLevel._id;
            newLevel[oppositeKey] = level._id;

            await Promise.all([db.saveLevel(level), db.saveLevel(newLevel)]);
            await handleLevelTransition(level, newLevel);
        } catch (err) {
            console.error("Error transitioning to next level:", err);
        }
    });


    socket.on("resetLevel", async () => {

        if (socket.user.currentLevel){
            game.deleteLevel(socket.user.currentLevel);
        }

        const level = await game.createLevel();
        level.enemies = [];
        await db.saveLevel(level);
        updateCurrentJWT(level);
        socket.emit("currentLevel", { data: level });
    })
        socket.on("getLevel", async (id) => {
        try {
            let level;
            if (!id) {
                if (socket.user.currentLevel) {
                    level = await db.getLevelById(socket.user.currentLevel);
                    if (!level){
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
        cancel = delay(5000, () => {
            game.deleteLevel(socket.user.currentLevel);
        });
        console.log("❌ Player disconnected:", socket.user.id);
    });
});

const port = process.env.PORT || 3001;

httpServer.listen(port, () => {
    console.log("Socket.IO server running on ws://localhost:"+port);
});
