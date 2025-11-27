// behaviors/attackHero.js

function disableHitbox(enemy) {
    if (enemy.isDead) return;
    enemy.attackHitbox.body.enable = false;
    enemy.attackHitbox.active = false;
}

function enableHitbox(enemy, offsetX, offsetY, sizeX, sizeY) {
    if (enemy.isDead) return;

    enemy.attackHitbox.body.enable = true;
    enemy.attackHitbox.active = true;
    enemy.attackHitbox.setSize(sizeX, sizeY);
    enemy.attackHitbox.body.setSize(sizeX, sizeY);
    enemy.attackHitbox.setPosition(enemy.x + offsetX, enemy.y + offsetY);
}

function attack(enemy, offsetX, offsetY, sizeX, sizeY) {
    enableHitbox(enemy, offsetX, offsetY, sizeX, sizeY);

    enemy.scene.time.delayedCall(15, () => {
        disableHitbox(enemy);
    });
}


export function attackHero(enemy) {

    if (enemy.isAnimating) return;

    const attackKey = Phaser.Utils.Array.GetRandom(enemy.animKeys.attacks);

    enemy.anims.play(attackKey);
    enemy.isAnimating = true;
    enemy.canAttack = false;

    enemy.once("animationcomplete-" + attackKey, () => {

        if (!enemy.isDead) {
            // Position hitbox depending on facing direction
            if (!enemy.flipX) {
                attack(enemy, enemy.attackOffset, 120, enemy.attackRange, 200);
            } else {
                attack(enemy, enemy.attackOffset + 50, 120, enemy.attackRange, 200);
            }
        }

        // Reset cooldown
        enemy.scene.time.delayedCall(enemy.attackSpeed, () => {
            enemy.canAttack = true;
        });

        enemy.isAnimating = false;
    });
}
