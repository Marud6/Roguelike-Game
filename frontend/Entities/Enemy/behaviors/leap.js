// behaviors/leap.js
export function leapToPlayer(enemy, player) {
    if (!enemy.canLeap) return;

    enemy.canLeap = false;

    // Play leap animation
    enemy.anims.play(enemy.animKeys.jump);

    // Determine direction
    const direction = player.x < enemy.x ? -1 : 1;

    // Apply physics velocities
    enemy.setVelocityX(enemy.leapRange * direction);
    enemy.setVelocityY(-400);

    enemy.isLeaping = true;

    // Flip sprite
    enemy.flipX = direction < 0;

    // Adjust hitbox offset
    if (direction < 0) {
        enemy.body.setOffset(enemy.offSetX + enemy.offSetXLeft, enemy.offSetY);
    } else {
        enemy.body.setOffset(enemy.offSetX, enemy.offSetY);
    }

    // Listen for animation completion
    enemy.once("animationcomplete-" + enemy.animKeys.jump, () => {
        enemy.isLeaping = false;
    });

    // Cooldown
    enemy.scene.time.delayedCall(enemy.leapCooldown, () => {
        enemy.canLeap = true;
    });
}
