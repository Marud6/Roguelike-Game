import Knight from "../Entities/Knight.js";
import Nature from "../Utils/Nature.js";
import EnemyAnimation from "../Entities/Enemy/EnemyAnimations";
import Projectile from "../Entities/Projectile.js";
import EnemyFactory from "../Entities/Enemy/EnemyFactory"
import Phaser from "phaser";
import  {initSocket,resetLevel, sendGetLevel, sendMoveLevel} from "../Utils/SocketIo.js";
import Player from "../Entities/Player";


export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }
  preload() {
    Knight.preloadAssets(this);
    Nature.preloadAssets(this);
    EnemyAnimation.preloadAssets(this);
    this.load.image("bg1", "assets/Environment/Background/background 1/orig_big.png");
    this.load.image('ground', 'assets/Environment/grass2.png');
  }

  create() {
    const { width, height } = this.sys.canvas;
    sendGetLevel()

    this.scene.launch('MenuScene');
    this.menuScene = this.scene.get('MenuScene');
    this.add.image(width / 2, height / 2, "bg1")
        .setOrigin(0.5)
        .setDisplaySize(width, height);
    this.ground = this.physics.add.staticImage(width / 2, height-40, 'ground');

    this.username=localStorage.getItem("username");
    // Adjust size if needed
    this.ground.displayWidth = width;   // stretch the image to screen width
    this.ground.setScale(0.7);            // scale if your sprite is small
    this.ground.refreshBody();

    // Knight
    this.knight = new Knight(this, 200, height - 500,this.menuScene);
    this.knight.setDepth(1);

    // Enemies
    this.enemies = this.physics.add.group();

    //projectiles group
    this.projectiles = this.physics.add.group();

    //other players
    this.players=[]



    // Collisions
    this.physics.add.collider(this.knight, this.ground);

    // Overlaps: Knight → Enemies
    this.physics.add.overlap(
        this.knight.attackHitbox,
        this.enemies,
        (hitbox, enemy) => enemy.takeDamage(this.knight.damage)
    );
    this.physics.add.overlap(
        this.knight.attackHitbox,
        this.projectiles,
        (hitbox, projectile) => projectile.destroy()
    );



    // Tab key to toggle menu
    this.tabKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

    initSocket(this);
  }




  updateBars(knight){
    this.menuScene.updateXp(knight.xp/knight.xpForLevel)
    this.menuScene.updateHealth(knight.health/knight.maxHealth)
    this.menuScene.updateStamina(knight.stamina/knight.maxStamina)
  }

  joinNewPlayer(x,username){
    const playerInstance=new Player(this,x,200,username)
    this.physics.add.collider(playerInstance, this.ground);
    this.players.push(playerInstance)
  }

  updatePlayer(username,data){
    const player=this.players.find(player => player.username === username)
    if (player) player.updateData(data);
  }

  loadLevel(data) {
    this.levelId = data.data._id;
    this.enemies.getChildren().forEach(enemy => {
      enemy.isDead = true;
      enemy.destroyEnemy();
    });
    this.enemies.clear(true);
    Nature.destroyNature(this)
    Nature.loadNature(this,data.data.nature)

    let enemiesArray = data.data.enemies || [];

   // enemiesArray=[{type:"blackWerewolf",x:1500,y:200}]
    enemiesArray.forEach(enemyData => {
      const enemyInstance = EnemyFactory.create(this, enemyData);
      this.enemies.add(enemyInstance);
      this.physics.add.collider(enemyInstance, this.ground);
      this.physics.add.overlap(
          enemyInstance.attackHitbox,
          this.knight,
          (hitbox, knight) => knight.gotHit(enemyInstance.damage)
      );
    });
  }

  spawnProjectile(x,y,type,force,projectileTypes,damage){

    const projectileInstance= new Projectile(this,x,y,type,projectileTypes);
    this.physics.add.collider(projectileInstance, this.ground);
    this.projectiles.add(projectileInstance)
    projectileInstance.flipX = force < 0;
      projectileInstance.setVelocityX(force);
    projectileInstance.body.setGravityY(-480);
    this.physics.add.overlap(
        projectileInstance,
        this.knight,
        (projectile, knight) => knight.gotHit(damage,projectileInstance)
    );
  }


  toNextLevel(){
    if (this.menuScene?.menuActive) return;
    const rightEdge = this.sys.canvas.width;
    if (this.knight.x - this.knight.width / 2 <= 0) {
      this.knight.x = rightEdge - this.knight.width / 2-50;
      const enemiesArray = this.enemies.getChildren()
          .filter(enemy => !enemy.isDead) // skip dead enemies
          .map(enemy => ({
            type: enemy.type,
            x: enemy.x,
            y: enemy.y,
            health: enemy.health

          }));

      sendMoveLevel(this.levelId,false, enemiesArray)


    }else if (this.knight.x + this.knight.width / 2 >= rightEdge) {
      this.knight.x = this.knight.width / 2+50;
      const enemiesArray = this.enemies.getChildren()
          .filter(enemy => !enemy.isDead) // skip dead enemies
          .map(enemy => ({
            type: enemy.type,
            x: enemy.x,
            y: enemy.y,
            health: enemy.health
          }));

      sendMoveLevel(this.levelId,true, enemiesArray)

    }
  }

  update() {
    this.updateBars(this.knight)
    this.toNextLevel()

    // Update knight
    this.knight.update();

    // Update enemies
    this.enemies.getChildren().forEach(enemy => {
      enemy.update(this.knight);
    });


  }


}
