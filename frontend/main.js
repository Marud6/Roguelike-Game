import Phaser from "phaser";
import GameScene from "./scenes/GameScene.js";
import MenuScene from "./scenes/MenuScene.js";

const BASE_WIDTH = 2000;
const BASE_HEIGHT = 1080;

const config = {
    type: Phaser.AUTO,
    backgroundColor: "#000000",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: { gravity: { y: 500 } },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: BASE_WIDTH,
        height: BASE_HEIGHT,
    },
    scene: [GameScene, MenuScene],
};

const game = new Phaser.Game(config);

window.addEventListener("resize", () => {
    game.scale.refresh();
});
