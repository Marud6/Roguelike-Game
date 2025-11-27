// behaviors/chase.js

export function chasePlayer(enemy, player) {
    const direction = player.x < enemy.x ? -1 : 1;

    // Movement
    enemy.setVelocityX(enemy.speed * direction);

    // Flip sprite
    enemy.flipX = direction < 0;

    // Adjust hitbox offset based on direction
    if (direction < 0) {
        enemy.body.setOffset(enemy.offSetX + enemy.offSetXLeft, enemy.offSetY);
    } else {
        enemy.body.setOffset(enemy.offSetX, enemy.offSetY);
    }

    // Play walk animation if not already playing
    if (
        enemy.animKeys.walk &&
        enemy.anims.currentAnim?.key !== enemy.animKeys.walk
    ) {
        enemy.anims.play(enemy.animKeys.walk);
    }
}
