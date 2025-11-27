import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,username) {
        super(scene, x, y, "player");
        this.username=username;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setScale(5);
        this.body.setSize(20, 40);
        this.body.setOffset(45, 40);
        this.anims.play("idle");

    }
    updateData(data){
        console.log(data);
    }







}
