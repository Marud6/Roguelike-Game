// behaviors/rangeAttack.js
import Phaser from "phaser";

export function rangeAttack(enemy, player) {

    enemy.canRangeAttack = false;
    enemy.isAnimating = true;

    // Direction logic
    const direction = player.x < enemy.x ? -1 : 1;
    enemy.direction = direction;
    enemy.flipX = direction < 0;

    // Hitbox offset
    if (direction < 0) {
        enemy.body.setOffset(enemy.offsetX + enemy.offsetXLeft, enemy.offsetY);
    } else {
        enemy.body.setOffset(enemy.offsetX, enemy.offsetY);
    }

    // Pick random ranged attack animation
    const attackKey = Phaser.Utils.Array.GetRandom(enemy.animKeys.rangeAttacks);
    const attackIndex = enemy.animKeys.rangeAttacks.indexOf(attackKey);

    enemy.anims.play(attackKey);

    enemy.fire = true;

    // Fire projectile at specific animation frame
    const onUpdate = (animation, frame) => {
        if (
            animation.key === attackKey &&
            frame.index === enemy.rangeAttackFrame &&
            enemy.fire
        ) {
            enemy.scene.spawnProjectile(
                enemy.x,
                enemy.y + enemy.spawnY[attackIndex],
                enemy.type,
                enemy.direction * 400,
                enemy.projectileTypes,
                enemy.projectileDamage
            );

            enemy.fire = false;
        }
    };

    // Attach update listener
    enemy.on("animationupdate", onUpdate);

    // Cleanup after animation ends
    enemy.once("animationcomplete-" + attackKey, () => {
        enemy.off("animationupdate", onUpdate);
        enemy.isAnimating = false;
        enemy.isAttacking = false;
    });

    // Cooldown reset
    enemy.scene.time.delayedCall(enemy.rangeAttackSpeed, () => {
        enemy.canRangeAttack = true;
    });

}
