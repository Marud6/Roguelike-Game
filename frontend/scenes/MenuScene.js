import Phaser from "phaser";
import {resetLevel} from "../Utils/SocketIo";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }
  preload() {
    this.load.image("menuOverlay", "assets/menu/menuBg.png");
    this.load.image("bulb", "assets/menu/content/bulb/1.png");
    this.load.image("emptyBar", "assets/menu/content/emptyBar.png");
    this.load.image("fullBar", "assets/menu/content/fullBar.png");
    this.load.image("staminaBar", "assets/menu/content/fullStamina.png");
    this.load.image("sideTabs", "assets/menu/content/Side Tabs/0.png");
    this.load.image("holder", "assets/menu/content/Holders/4.png");

  }
  updateHealth(percent) {
    if (this.healthBar) {
      percent = Phaser.Math.Clamp(percent, 0, 1);
      this.healthBar.setCrop(
        0,
        0,
        this.healthBarWidth * percent,
        this.healthBar.height
      );
    }
  }
  updateStamina(percent) {
    if (this.staminahBar) {
      percent = Phaser.Math.Clamp(percent, 0, 1);
      this.staminahBar.setCrop(
        0,
        0,
        this.staminaBarWidth * percent,
        this.staminahBar.height
      );
    }
  }
  updateXp(percent) {
    if (this.xpBar) {
      percent = Phaser.Math.Clamp(percent, 0, 1);
      this.xpBar.setCrop(0, 0, this.xpBarWidth * percent, this.xpBar.height);
    }
  }

  // MenuScene.js
  create() {
    const { width, height } = this.sys.canvas;

    // Health and stamina bars
    [
      {
        y: height / 20,
        key: "fullBar",
        prop: "healthBar",
        widthProp: "healthBarWidth",
      },
      {
        y: height / 8,
        key: "staminaBar",
        prop: "staminahBar",
        widthProp: "staminaBarWidth",
      },
    ].forEach((bar) => {
      this.add
        .image(width / 5, bar.y, "emptyBar")
        .setDepth(100)
        .setScale(1);
      this[bar.prop] = this.add
        .image(width / 5, bar.y, bar.key)
        .setDepth(100)
        .setScale(1);
      this[bar.widthProp] = this[bar.prop].width;
    });

    this.menuBackground = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
      .setDepth(99);
    this.menuOverlay = this.add
      .image(width / 2, height / 2, "menuOverlay")
      .setDepth(100)
      .setScale(3);
    this.menuImages = [];


    this.resetButton = this.add
        .image(width / 2-750, height / 2 , "sideTabs")
        .setDepth(100)
        .setScale(3);
    this.resetText = this.add
        .text(width / 2 - 725, height / 2+25 , "reset \n Level", {
          fontSize: "20px",
          color: "red",
          fontFamily: "Arial",
          align: "center",
        })
        .setOrigin(1)
        .setDepth(102);

    this.resetButton.setInteractive({ useHandCursor: true });
    this.resetButton.on("pointerdown", () => {
      resetLevel()
    })


    this.menuImages.push(this.resetText);
    this.menuImages.push(this.resetButton);


    this.xpBarOuter = this.add
      .image(width / 2+120, height / 2-300 , "emptyBar")
      .setDepth(100)
      .setScale(1);
    this.xpBar = this.add
      .image(width / 2 + 120, height / 2 - 300, "fullBar")
      .setDepth(100)
      .setScale(1);
    this.xpBarWidth = this.xpBar.width;
    this.menuImages.push(this.xpBarOuter);
    this.menuImages.push(this.xpBar);

    this.menuText = this.add
      .text(width / 2 + 180, height / 2 - 330, "Level: 0", {
        fontSize: "28px",
        color: "#1d1d12",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(1)
      .setDepth(102);
    this.menuImages.push(this.menuText);
    this.levelsToUse = this.add
      .text(width / 2 + 130, height / 2 - 270, "0 levels to use", {
        fontSize: "20px",
        color: "green",
        fontFamily: "Arial",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(102);
    this.menuImages.push(this.levelsToUse);

    this.gameScene = this.scene.get("GameScene");
    // Upgrade buttons config
    const buttons = [
      {
        x: width / 2 - 140,
        y: height / 2 - 150,
        text: "damage",
        prop: "damageBonus",
        amount: 10,
      },
      {
        x: width / 2+40,
        y: height / 2 - 150,
        text: "speed",
        prop: "speedBonus",
        amount: 50,
      },
      {
        x: width / 2+220,
        y: height / 2 - 150,
        text: "roll distance",
        prop: "rollBonus",
        amount: 50,
      },
      {
        x: width / 2+420,
        y: height / 2 - 150,
        text: "max health",
        prop: "maxHealth",
        amount: 50,
      },
      {
        x: width / 2+420,
        y: height / 2 -50,
        text: "max stamina",
        prop: "maxStamina",
        amount: 50,
      },

      {
        x: width / 2 - 140,
        y: height / 2 -50,
        text: "stamina regen",
        prop: "staminaRegen",
        amount: 0.1,
      },
      {
        x: width / 2+40,
        y: height / 2 -50,
        text: "health regen",
        prop: "healthRegen",
        amount: 0.01,
      },
      {
        x: width / 2+220,
        y: height / 2 -50,
        text: "nothing",
        prop: "nothing",
        amount: 50,
      },



    ];
    buttons.forEach((btn) => {
      const img = this.add
        .image(btn.x, btn.y, "holder")
        .setOrigin(0.5)
        .setDepth(100)
        .setScale(2);

      const upgraded = this.add
            .text(btn.x, btn.y + 50,0 , {
            fontSize: "20px",
            color: "red",
            fontFamily: "Arial",
            align: "center",
          })
          .setOrigin(0.5)
          .setDepth(102);
        upgraded.y=upgraded.y-50


      const txt = this.add
        .text(btn.x, btn.y + 50, btn.text, {
          fontSize: "20px",
          color: "green",
          fontFamily: "Arial",
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(102);

      img.setInteractive({ useHandCursor: true });
      img.on("pointerdown", () => {
        if (this.gameScene.knight.levelToUse > 0) {
          this.gameScene.knight.levelToUse -= 1;

            this.gameScene.knight[btn.prop] = (this.gameScene.knight[btn.prop] || 0) + btn.amount;

          this.levelsToUse.setText(
              this.gameScene.knight.levelToUse + " levels to use"
          );
          if(btn.prop==="maxStamina"){
            upgraded.setText(this.gameScene.knight[btn.prop] / btn.amount-20);
          }if(btn.prop==="maxHealth"){
            upgraded.setText(this.gameScene.knight[btn.prop] / btn.amount-20);
          }else{
            upgraded.setText(this.gameScene.knight[btn.prop] / btn.amount);
          }

        }
      });

      this.menuImages.push(img, txt,upgraded);
    });

    const bulb = this.add
      .image(width / 2 -463, height / 2 - 25  , "bulb")
      .setDepth(101)
      .setScale(3);
    this.menuImages.push(bulb);


    // Hide everything initially
    this.menuBackground.setVisible(false);
    this.menuOverlay.setVisible(false);
    this.menuImages.forEach((img) => img.setVisible(false));

    // Menu state
    this.menuActive = false;

    // Tab key toggles menu
    this.tabKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.TAB
    );
    this.tabKey.on("down", () => {
      this.menuActive = !this.menuActive;
      this.menuBackground.setVisible(this.menuActive);
      this.menuOverlay.setVisible(this.menuActive);
      this.menuImages.forEach((img) => img.setVisible(this.menuActive));
    });
  }
  updateLevel(level, levelToUse) {
    if (this.menuText) this.menuText.setText("Level: " + level);
    if (this.levelsToUse)
      this.levelsToUse.setText(levelToUse + " levels to use");
  }

  update() {
    // Nothing else needed here; GameScene will toggle menu
  }
}
