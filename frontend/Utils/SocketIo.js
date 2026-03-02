import { io } from "socket.io-client";
import GameScene from "../scenes/GameScene";
let token = localStorage.getItem("jwt");
const socket_server = import.meta.env.VITE_SOCKET_IO_URL || "http://localhost:5000"

const socket = io(socket_server, { auth: { token } });
let gameScene = null;

export function initSocket(scene) {
    gameScene = scene;
}

socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});

socket.on("currentLevel", (data) => {
    if (data.error) {
        console.error("Server error:", data.error);
        return;
    }
    if (gameScene && data.data) {
        gameScene.loadLevel(data);
    }
});

socket.on("assignToken", (data) => {
    localStorage.setItem("jwt", data.token);
    token = data.token;
});
socket.on("assignUsername", (data) => {
    localStorage.setItem("username", data.username);
    GameScene.username = data.username;
    console.log(data)
});


export function resetLevel() {
    socket.emit("resetLevel" );
}

export function sendMoveLevel(currentLevel,right,enemies) {
    socket.emit("nextLevel", currentLevel,right,enemies );
}
export function sendGetLevel(id) {
    socket.emit("getLevel", id );
}


export default socket;
