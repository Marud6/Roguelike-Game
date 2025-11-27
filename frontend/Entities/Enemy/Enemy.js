// Enemy.js
import enemies from './config/enemies.json' assert { type: 'json' };
import Phaser from "phaser";
import EnemyAnimation from "./EnemyAnimations";
import {leapToPlayer}  from "./behaviors/leap";
import {chasePlayer} from "./behaviors/chase";
import {rangeAttack} from "./behaviors/rangeAttack";
import {attackHero} from "./behaviors/attackPlayer";
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, config) {
        super(scene, x, y, config.type + "Idle"); // initial texture is the Idle sheet
        this.scene = scene;
        this.config = config;
        Object.assign(this, config);

        // Scene + physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setScale(3);
        this.body.setSize(35, 60);
        this.canAttack=true
        this.body.setOffset(this.offSetX, this.offSetY);
        // Hitbox
        this.attackHitbox = scene.add.zone(0, 0, 40, 40);
        scene.physics.add.existing(this.attackHitbox);
        this.attackHitbox.body.allowGravity = false;
        this.attackHitbox.active = false;
        //leap
        this.isLeaping=false
        //range
        this.rangeAttackSpeed=5000
        this.projectileTypes=1
        this.canRange=true
        // Animations

        EnemyAnimation.createAnimations(scene,this);
        this.animKeys=EnemyAnimation.buildAnimKeys(this)
        this.anims.play(this.animKeys.idle);
    }



    destroyEnemy() {

        this.destroy();
        this.attackHitbox.destroy()
    }

    takeDamage(amount = 10) {
        if(this.isDead) return;
        this.anims.play(this.animKeys.hit);
        this.isAnimating=true
        this.healPoints -= amount;

        this.once("animationcomplete-"+this.animKeys.hit, () => {
            if(this.healPoints<=0){
                this.isDead=true
                this.setVelocityX(0);
                this.player.xp += this.xpGain;
                this.anims.play(this.animKeys.death);
                this.scene.time.delayedCall(3000  , () => {
                    this.destroyEnemy();
                });
            }
            this.isLeaping=false
            this.isAttaking=false
            this.isAnimating=false
            this.canAttack=true
        })
    }

    update(player) {
        this.player=player
        if (this.isAnimating || this.isDead|| this.isLeaping) return;
        if (!player) return; // make sure player exists
        let dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if(dist > this.attackRange && this.isRange && dist < this.rangeAttackRange && this.canRange){
            this.setVelocityX(0);
            rangeAttack(this,player)
        }else if( dist > this.attackRange && dist < this.leapRange && this.canLeap){
            leapToPlayer(this, player)
        }else if(dist > this.attackRange &&this.isChasing && !this.isLeaping){
            chasePlayer(this,player)
        }

        if(player.isCrouching){
            dist= dist*2
        }
        if (dist < this.aggroRange && dist > this.attackRange ) {
            this.isChasing=true;
        } else if (dist <= this.attackRange && this.canAttack && this.body.touching.down) {
            this.setVelocityX(0);
            if (!this.isAttaking) {
                this.isAttaking = true;
                attackHero(this);
                const direction = player.x < this.x ? -1 : 1;
                this.flipX = direction < 0;
                this.scene.time.delayedCall(1000, () => {
                    this.isAttaking = false;
                });
            }
        } else if(this.isChasing===false || dist <= this.attackRange) {
            this.setVelocityX(0);
            if (this.animKeys.idle && this.anims.currentAnim?.key !== this.animKeys.idle) {
                this.anims.play(this.animKeys.idle);
            }
        }

    }

}
