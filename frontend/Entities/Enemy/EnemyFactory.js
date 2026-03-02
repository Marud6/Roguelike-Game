import Enemy from './Enemy.js';
import enemies from "./config/enemies.json";

export default class EnemyFactory {
    static create(scene, enemyData){
        const enemyArray = Object.values(enemies.enemies);
        const def = enemyArray.find(e => e.type === enemyData.type);

        const enemy = new Enemy(scene, enemyData.x, enemyData.y, def);
        return enemy;
    }
}