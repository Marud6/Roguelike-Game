import Phaser from "phaser";
export default class Knight extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y,menuScene) {

    super(scene, x, y, "knightIdle");

    this.damage = 0;
    this.health = 100;
    this.maxHealth=100;
    this.Stamina = 1000;
    this.maxStamina=1000
    this.level=0;
    this.levelToUse=0;
    this.xp=10;
    this.xpForLevel=10
    this.scene = scene;
    this.isAnimating = false;
    this.isRolling=false
    this.isDeath = false;
    this.menuScene = menuScene;

    this.staminaRegen=0
    this.healthRegen=0

    this.speedBonus=0
    this.damageBonus=0;
    this.rollBonus=0;

    this.isCrouching=false


    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // Setup physics properties
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    this.setScale(5);
    this.body.setSize(20, 40);
    this.body.setOffset(45, 40);

    //attack hitbox
    this.attackHitbox = this.scene.add.zone(0, 0, 40, 40);
    this.scene.physics.add.existing(this.attackHitbox);
    this.attackHitbox.body.allowGravity = false;
    this.attackHitbox.active = false;

    this.setupInput();

    this.setupAnimations();

    this.setupAnimationEvents();

    this.anims.play("idle");
  }

  static preloadAssets(scene) {
    scene.load.spritesheet("knightIdle", "assets/Knight/Animations/_Idle.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    scene.load.spritesheet("knightRun", "assets/Knight/Animations/_Run.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    scene.load.spritesheet("knightJump", "assets/Knight/Animations/_Jump.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    scene.load.spritesheet(
      "knightJumpFall",
      "assets/Knight/Animations/_JumpFallInbetween.png",
      { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet("knightFall", "assets/Knight/Animations/_Fall.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    scene.load.spritesheet(
      "knightCrouchTransition",
      "assets/Knight/Animations/_CrouchTransition.png",
      { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
      "knightCrouch",
      "assets/Knight/Animations/_Crouch.png",
      { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
      "knightCrouchRun",
      "assets/Knight/Animations/_CrouchWalk.png",
      { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet("knightRoll", "assets/Knight/Animations/_Roll.png", {
      frameWidth: 120,
      frameHeight: 80,
    });
    scene.load.spritesheet(
      "knightTurn",
      "assets/Knight/Animations/_TurnAround.png",
      { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
      "knightSlideStart",
      "assets/Knight/Animations/_SlideTransitionStart.png",
      { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
      "knightSlideEnd",
      "assets/Knight/Animations/_SlideTransitionEnd.png",
      { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
      "knightSlideFull",
      "assets/Knight/Animations/_SlideFull.png",
      { frameWidth: 120, frameHeight: 80 }
    );
      scene.load.spritesheet(
          "knightAttack",
          "assets/Knight/Animations/_Attack.png",
          { frameWidth: 120, frameHeight: 80 }
      );
      scene.load.spritesheet(
          "knightAttackStrong",
          "assets/Knight/Animations/_Attack2.png",
          { frameWidth: 120, frameHeight: 80 }
      );
    scene.load.spritesheet(
        "knightCrouchAttack",
        "assets/Knight/Animations/_CrouchAttack.png",
        { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
        "knightAttackCombo",
        "assets/Knight/Animations/_AttackCombo2hit.png",
        { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
        "knightDeath",
        "assets/Knight/Animations/_Death.png",
        { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
        "knightHit",
        "assets/Knight/Animations/_Hit.png",
        { frameWidth: 120, frameHeight: 80 }
    );
    scene.load.spritesheet(
        "knightTurn",
        "assets/Knight/Animations/_TurnAround.png",
        { frameWidth: 120, frameHeight: 80 }
    );

  }


  setupInput() {
    // Input: Cursor keys
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Input: WASD
    this.wasd = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
        e: Phaser.Input.Keyboard.KeyCodes.E,
        q: Phaser.Input.Keyboard.KeyCodes.Q


    });
  }

  setupAnimations() {
    // Animations
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("knightIdle", {
        start: 0,
        end: 9,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("knightRun", {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "jump",
      frames: this.scene.anims.generateFrameNumbers("knightJump", {
        start: 0,
        end: 2,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "jumpFall",
      frames: this.scene.anims.generateFrameNumbers("knightJumpFall", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "fall",
      frames: this.scene.anims.generateFrameNumbers("knightFall", {
        start: 0,
        end: 2,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "crouchTransition",
      frames: this.scene.anims.generateFrameNumbers("knightCrouchTransition", {
        start: 0,
        end: 0,
      }),
      frameRate: 6,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "crouch",
      frames: this.scene.anims.generateFrameNumbers("knightCrouch", {
        start: 0,
        end: 0,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "crouchRun",
      frames: this.scene.anims.generateFrameNumbers("knightCrouchRun", {
        start: 0,
        end: 7,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.scene.anims.create({
      key: "roll",
      frames: this.scene.anims.generateFrameNumbers("knightRoll", {
        start: 0,
        end: 11,
      }),
      frameRate: 20,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "slideStart",
      frames: this.scene.anims.generateFrameNumbers("knightSlideStart", {
        start: 0,
        end: 0,
      }),
      frameRate: 12,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "slideEnd",
      frames: this.scene.anims.generateFrameNumbers("knightSlideEnd", {
        start: 0,
        end: 0,
      }),
      frameRate: 12,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "slide",
      frames: this.scene.anims.generateFrameNumbers("knightSlideFull", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "attack",
      frames: this.scene.anims.generateFrameNumbers("knightAttack", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "attackStrong",
      frames: this.scene.anims.generateFrameNumbers("knightAttackStrong", {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "attackCrouch",
      frames: this.scene.anims.generateFrameNumbers("knightCrouchAttack", {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "attackCombo",
      frames: this.scene.anims.generateFrameNumbers("knightAttackCombo", {
        start: 0,
        end: 9,
      }),
      frameRate: 12,
      repeat: 0,
    });
    this.scene.anims.create({
      key: "hit",
      frames: this.scene.anims.generateFrameNumbers("knightHit", {
        start: 0,
        end: 0,
      }),
      frameRate: 6,
      repeat: 0,
    });



    this.scene.anims.create({
      key: "turn",
      frames: this.scene.anims.generateFrameNumbers("knightTurn", {
        start: 0,
        end: 2,
      }),
      frameRate: 16,
      repeat: 0,
    });

    this.scene.anims.create({
      key: "death",
      frames: this.scene.anims.generateFrameNumbers("knightDeath", {
        start: 0,
        end: 9,
      }),
      frameRate: 6,
      repeat: 0,
    });
  }

  setupAnimationEvents() {
    this.on("animationcomplete-jumpFall", () => {
      if (!this.body.touching.down) {
        this.anims.play("fall");
      }
    });
    this.on("animationcomplete-crouchTransition", () => {
      if (this.body.touching.down) {
        this.anims.play("crouch");
        this.isCrouching=true
      }
    });
  }

  updateKnightCollider(increase = 0) {
    if (this.flipX) {
      this.body.setOffset(55, 40 + increase);
    } else {
      this.body.setOffset(45, 40 + increase);
    }
  }

  enableHitbox(offsetX, offsetY,sizeX,sizeY) {
    this.attackHitbox.active = true;
    this.attackHitbox.visible = true;
    this.attackHitbox.body.setSize(sizeX, sizeY);    // Position relative to knight
    if (this.flipX) this.attackHitbox.x = this.x - offsetX;
    else this.attackHitbox.x = this.x + offsetX;
    this.attackHitbox.y = this.y + offsetY;
    this.attackHitbox.body.enable = true;

  }

  disableHitbox() {
    this.attackHitbox.body.enable = false;
  }
  gotHit(amount,projectile=null){
    if(this.isDeath|| this.isRolling)return
    if(projectile){projectile.destroy();}

    this.anims.play("hit");
    this.isAnimating=true
    this.health -= amount
    if(this.health <= 0){
      this.death()
    }
    this.once("animationcomplete-hit", () => {
      this.isAnimating=false
      this.isRolling=false
    })
  }

  death(){
    this.isDeath=true
    this.setVelocityX(0);
    this.anims.play("death");
    this.once("animationcomplete-death", () => {
    })
  }
  updateLevel(){
    this.level+=1;
    this.levelToUse +=1;
    this.xpForLevel=10+this.level*10
    this.xp=0;

    this.scene.time.delayedCall(200  , () => {
      this.menuScene.updateLevel(this.level, this.levelToUse)
    });
  }

  attack(offsetX, offsetY,sizeX,sizeY) {
    this.enableHitbox(offsetX, offsetY,sizeX,sizeY);
    this.scene.time.delayedCall(15  , () => {
      this.disableHitbox()
    });
  }

//spaming key jams animations
  update() {
    if (this.isAnimating||this.isDeath ||this.isRolling) return;
    this.setVelocityX(0);
    // Merge WASD + Arrow keys

    if(this.xp>=this.xpForLevel){
      this.updateLevel()
    }

    if(this.Stamina<this.maxStamina){
      this.Stamina +=1+this.staminaRegen;
    }
    if(this.health<this.maxHealth){
      this.health +=0.01+this.healthRegen;
    }


    if(this.anims.currentAnim?.key !== "crouchRun" && this.anims.currentAnim?.key !== "crouch" && this.anims.currentAnim?.key !== "crouchTransition"){
      this.isCrouching=false
    }
    this.on("animationupdate", (animation, frame) => {
      if (animation.key === "attackCrouch" && frame.index === 2) {
        this.attack(100, 130, 200, 130);
      }
      else if (animation.key === "attack" && frame.index === 2) {
        this.attack(150, 100, 250, 200);
      }
      else if (animation.key === "attackCombo" && frame.index === 3) {
        this.attack(150, 100, 250, 200);
      }
      else if (animation.key === "attackStrong" && frame.index === 3) {
        this.attack(120, 100, 230, 200);
      }
    });



    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;
    const space =
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.space);
    const keyQ=Phaser.Input.Keyboard.JustDown(this.wasd.q)
    const keyE=Phaser.Input.Keyboard.JustDown(this.wasd.e)
      if (keyE && this.body.touching.down && this.Stamina>200) {
        this.Stamina -=200;

        if (down && this.body.touching.down && !this.isAnimating && this.anims.currentAnim?.key !== "attackCrouch") {
          this.damage = 10+this.damageBonus;
          this.isAnimating = true; // mark as busy before playing animation

          this.anims.play("attackCrouch");

          this.once("animationcomplete-attackCrouch", () => {
            this.isAnimating = false;
          });

          return;
        }
        else if (!this.isAnimating && this.body.touching.down && this.anims.currentAnim?.key !== "attack") {
          this.damage = 20+this.damageBonus;
          this.isAnimating = true;

          this.anims.play("attack");

          this.once("animationcomplete-attack", () => {
            this.isAnimating = false;
          });

          return;
        }

      }
    if (keyQ && this.body.touching.down && !this.isAnimating && this.Stamina>300) {
      this.Stamina -=300;
      if (down) {
        // Big crouch attack (attackCombo)
        if (this.anims.currentAnim?.key !== "attackCombo") {
          this.damage = 50+this.damageBonus;
          this.isAnimating = true;

          this.anims.play("attackCombo");

          this.once("animationcomplete-attackCombo", () => {
            this.isAnimating = false;
          });
        }
      } else {
        // Big standing attack (attackStrong)
        if (this.anims.currentAnim?.key !== "attackStrong") {
          this.damage = 30+this.damageBonus;
          this.isAnimating = true;

          this.anims.play("attackStrong");

          this.once("animationcomplete-attackStrong", () => {
            this.isAnimating = false;
          });
        }
      }
      return;
    }


    if (space && this.body.velocity.y < 0 && this.Stamina>100) {
      this.Stamina -=100;

      if (down) {
        this.isRolling = true;
        this.body.setSize(20, 20);
        this.updateKnightCollider(20);

        const rollSpeed = this.flipX ? -400-this.rollBonus : 400+this.rollBonus;
        this.setVelocityX(rollSpeed);

        this.anims.play("slideStart");

        this.once("animationcomplete-slideStart", () => {
          this.anims.play("slide");
          this.once("animationcomplete-slide", () => {
            this.anims.play("slideEnd");
            this.once("animationcomplete-slideEnd", () => {
              this.isRolling = false;
              this.setVelocityX(0);
            });
          });
        });

        return;
      } else {
        this.body.setSize(20, 30);
        this.updateKnightCollider(10);
        this.isRolling = true;

        const rollSpeed = this.flipX ? -300-this.rollBonus : 300+this.rollBonus;
        this.setVelocityX(rollSpeed);
        this.anims.play("roll");

        this.once("animationcomplete-roll", () => {
          this.isRolling = false;
          this.setVelocityX(0);

          if (left) {
            this.setVelocityX(-200);
            this.anims.play("run");
          } else if (right) {
            this.setVelocityX(200);
            this.anims.play("run");
          } else {
            this.body.setSize(20, 40);
            this.updateKnightCollider();
            this.anims.play("idle");
          }
        });

        return;
      }
    }

    if (down && right) {
      this.body.setSize(20, 25);
      this.setVelocityX(100);
      this.flipX = false;
      this.updateKnightCollider(15);
      if (
        this.body.touching.down &&
        this.anims.currentAnim?.key !== "crouchRun"
      ) {
        this.isCrouching=true
        this.anims.play("crouchRun");

      }

    } else if (down && left) {
      this.body.setSize(20, 25);
      this.setVelocityX(-100);
      this.flipX = true;
      this.updateKnightCollider(15);
      if (
        this.body.touching.down &&
        this.anims.currentAnim?.key !== "crouchRun"
      ) {
        this.isCrouching=true
        this.anims.play("crouchRun");
      }
    } else if (right) {
      if(this.flipX){
        this.anims.play("turn");
        this.isAnimating=true
        this.once("animationcomplete-turn", () => {
          this.isAnimating=false
          this.flipX = false;

        })
        return
      }

      this.body.setSize(20, 40);
      this.setVelocityX(200+this.speedBonus);
      this.updateKnightCollider();
      if (this.body.touching.down && this.anims.currentAnim?.key !== "run") {
        this.anims.play("run");
      }
    } else if (left) {

      if(!this.flipX){
        this.anims.play("turn");
        this.isAnimating=true
        this.once("animationcomplete-turn", () => {
          this.isAnimating=false
          this.flipX = true;

        })
        return
      }



      this.body.setSize(20, 40);
      this.setVelocityX(-200-this.speedBonus);
      this.flipX = true;
      this.updateKnightCollider();
      if (this.body.touching.down && this.anims.currentAnim?.key !== "run") {
        this.anims.play("run");
      }
    } else if (down) {
      if (
        this.body.touching.down &&
        this.anims.currentAnim?.key !== "crouchTransition" &&
        this.anims.currentAnim?.key !== "crouch"
      ) {
        this.anims.play("crouchTransition");
        this.body.setSize(20, 25);
        this.updateKnightCollider(15);
      }
    } else if (this.body.touching.down) {
      if (this.anims.currentAnim?.key !== "idle") {
        this.body.setSize(20, 40);
        this.updateKnightCollider();
        this.anims.play("idle");
      }
    }

    if (!this.body.touching.down) {
      if (this.body.velocity.y < 0) {
        if (this.anims.currentAnim?.key !== "jump") this.anims.play("jump");
      } else {
        if (
          this.anims.currentAnim?.key !== "jumpFall" &&
          this.anims.currentAnim?.key !== "fall"
        ) {
          this.anims.play("jumpFall");
        }
      }
    }

    if (up && this.body.touching.down) {
      this.setVelocityY(-350);
    }
  }
}
