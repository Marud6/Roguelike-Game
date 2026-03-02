// EnemyAnimation.js
import Phaser from "phaser";
import enemies from "./config/enemies.json";


export default class EnemyAnimation {

    /**
     * Preload sprite sheets for ALL enemy types
     */
    static preloadAssets(scene, enemiesConfig) {

        for (let key in enemies.enemies) {
                const enemy=enemies.enemies[key];

            const baseRes = enemy.resolution;

            const assets = [
                [enemy.type + "Idle",  `assets/Enemies/${enemy.type}/Idle.png`],
                [enemy.type + "Hit",   `assets/Enemies/${enemy.type}/Hurt.png`],
                [enemy.type + "Death", `assets/Enemies/${enemy.type}/Dead.png`],
                [enemy.type + "Walk",  `assets/Enemies/${enemy.type}/Walk.png`],
            ];

            // Melee attack animations
            for (let i = 1; i <= enemy.attacks; i++) {
                assets.push([`${enemy.type}Attack${i}`, `assets/Enemies/${enemy.type}/Attack_${i}.png`]);
            }

            // Leap animation
            if (enemy.canLeap) {
                assets.push([enemy.type + "Jump", `assets/Enemies/${enemy.type}/Jump.png`]);
            }

            // Range attack animations
            if (enemy.isRanged) {
                for (let i = 1; i <= enemy.rangeAttackAnimation; i++) {
                    assets.push([`${enemy.type}rangeAttack${i}`, `assets/Enemies/${enemy.type}/rangeAttack${i}.png`]);
                }

                for (let i = 1; i <= enemy.projectileAnimation; i++) {
                    scene.load.spritesheet(
                        `${enemy.type}projectile${i}`,
                        `assets/Enemies/${enemy.type}/Projectile${i}.png`,
                        { frameWidth: enemy.projectileRes, frameHeight: enemy.projectileRes }
                    );
                }
            }

            // Load all sheets
            assets.forEach(([key, path]) => {
                scene.load.spritesheet(key, path, {
                    frameWidth: baseRes,
                    frameHeight: baseRes
                });
            });
        }
    }

    /**
     * Create animations for one enemy instance
     */
    static createAnimations(scene, enemyInstance) {

        const type = enemyInstance.type;

        const create = (key, sprite, frameRate, repeat = 0) => {
            if (!scene.anims.exists(key)) {
                const frameCount = scene.textures.get(sprite).frameTotal - 1;
                scene.anims.create({
                    key,
                    frames: scene.anims.generateFrameNumbers(sprite, { start: 0, end: frameCount - 1 }),
                    frameRate,
                    repeat
                });
            }
        };

        // Base animations
        create(`idle${type}`,  `${type}Idle`, 6, -1);
        create(`hit${type}`,   `${type}Hit`, 6);
        create(`death${type}`, `${type}Death`, 6);
        create(`walk${type}`,  `${type}Walk`, 6, -1);

        // Attack animations
        for (let i = 1; i <= enemyInstance.attacks; i++) {
            create(`attack${type}${i}`, `${type}Attack${i}`, 7);
        }

        // Leap
        if (enemyInstance.canLeap) {
            create(`Jump${type}`, `${type}Jump`, 12);
        }

        // Range attacks
        if (enemyInstance.isRanged) {
            for (let i = 1; i <= enemyInstance.rangeAttackAnimation; i++) {
                create(`rangeAttack${type}${i}`, `${type}rangeAttack${i}`, 6);
            }
        }
    }

    /**
     * Build animation key list for an enemy
     */
    static buildAnimKeys(enemy) {
        const type = enemy.type;

        return {
            idle:   `idle${type}`,
            hit:    `hit${type}`,
            death:  `death${type}`,
            walk:   `walk${type}`,
            jump:   enemy.canLeap ? `Jump${type}` : null,

            attacks: Array.from({length: enemy.attacks}, (_, i) =>
                `attack${type}${i + 1}`
            ),

            rangeAttacks: enemy.isRanged
                ? Array.from({ length: enemy.rangeAttackAnimation }, (_, i) =>
                    `rangeAttack${type}${i + 1}`
                )
                : []
        };
    }
}