import Phaser from "phaser";


export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,type,projectileTypes) {
        super(scene, x, y, "projectile");
        this.type = type;
        this.projectileTypes = projectileTypes;
        this.setScale(2)
        this.arrowAnimations=[]
        this.createAnimations(scene)
        const arrowAnimation = Phaser.Utils.Array.GetRandom(this.arrowAnimations)
        this.anims.play(arrowAnimation);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene.time.delayedCall(4000  , () => {
            this.destroy();
        });
    }

    createAnimations(scene) {
        const createAnim = (key, sprite, start, end, frameRate, repeat = -1) => {
            if (!scene.anims.exists(key)) {
                scene.anims.create({
                    key,
                    frames: scene.anims.generateFrameNumbers(sprite, { start, end }),
                    frameRate,
                    repeat,
                });
            }
        };
        for (let i = 1; i < this.projectileTypes+1; i++) {
            this.arrowAnimations.push("projectile"+this.type+i)
            createAnim("projectile"+this.type+i, this.type+"projectile"+i, 0, scene.textures.get(this.type+"projectile"+i).getFrameNames().length-1, 18);
        }

    }



}
