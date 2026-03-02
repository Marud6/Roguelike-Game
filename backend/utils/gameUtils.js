import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as db from "../db/mongo.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
    readFileSync(join(__dirname, "../config/gameLevelConfig.json"), "utf-8")
);

const MAX_SPAWN_ATTEMPTS = 100;
const NATURE_Y = 300;
const MIN_NATURE_DISTANCE = 100;
const MIN_OBJECT_DISTANCE = 50;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomX(otherData, minDistance, left = 100, right = 1900) {
    let tooClose;
    let x = 0;
    let attempts = 0;
    do {
        tooClose = false;
        x = getRandomInt(left, right);
        for (const obj of otherData) {
            const dist = Math.abs(obj.x - x);
            if (dist < minDistance) {
                tooClose = true;
                break;
            }
        }
        attempts++;
        if (attempts >= MAX_SPAWN_ATTEMPTS) break;
    } while (tooClose);
    return x;
}

export async function deleteLevel(id) {
    await db.deleteLevels(id);
}

export async function createLevel(right) {
    let rangeLeftX = 100;
    let rangeRightX = 1900;
    if (right === true) {
        rangeLeftX = 300;
        rangeRightX = 1900;
    } else if (right === false) {
        rangeLeftX = 200;
        rangeRightX = 1600;
    }

    const enemyCount = getRandomInt(config.enemyCount.min, config.enemyCount.max);
    const enemiesData = [];

    for (let i = 0; i < enemyCount; i++) {
        enemiesData.push({
            type: config.enemyTypes[getRandomInt(0, config.enemyTypes.length - 1)],
            x: getRandomX(enemiesData, MIN_NATURE_DISTANCE, rangeLeftX, rangeRightX),
            y: config.spawnY,
            health: 100,
        });
    }

    const natureData = [];
    const biome = config.biomes[getRandomInt(0, config.biomes.length - 1)];

    for (let i = 0; i < biome.count; i++) {
        natureData.push({
            type: biome.items[getRandomInt(0, biome.items.length - 1)],
            x: getRandomX(natureData, MIN_NATURE_DISTANCE),
            y: NATURE_Y,
        });
    }

    natureData.push({
        type: biome.object[getRandomInt(0, biome.object.length - 1)],
        x: getRandomX(natureData, MIN_OBJECT_DISTANCE),
        y: NATURE_Y,
    });

    const levelData = {
        createdAt: new Date(),
        right: null,
        left: null,
        nature: natureData,
        enemies: enemiesData,
    };

    const levelId = await db.saveLevel(levelData);

    return { _id: levelId, ...levelData };
}
