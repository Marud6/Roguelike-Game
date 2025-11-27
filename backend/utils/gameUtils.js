import * as db from "../db/mongo.js";


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomX(otherData, minDistance,left=100,right=1900) {
    let tooClose;
    let x = 0;
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
    } while (tooClose);
    return x;
}

export async function deleteLevel(id) {
    await db.deleteLevels(id)
}

export async function createLevel(right) {
    let rangeLeftX=100
    let rangeRightX=1900
    if(right===true){
        rangeLeftX=300
         rangeRightX=1900
    }else if(right===false){
         rangeLeftX=200
         rangeRightX=1600
    }

    const enemyCount = getRandomInt(2, 6);
    const enemiesType = ["skeletonSpearman","skeletonWarrior","skeletonArcher","knight1","knight2","knight3","blackWerewolf","whiteWerewolf","redWerewolf","gorgon1","gorgon2","gorgon3","ninjaMonk"]

    const enemiesData = [];

    for (let i = 0; i < enemyCount; i++) {


        const y = 693;
        enemiesData.push({
            type: enemiesType[getRandomInt(0, enemiesType.length - 1)],
            x:getRandomX(enemiesData,100,rangeLeftX,rangeRightX),
            y,
            health:100,
        });
    }
    const natureData = [];

    const bioms=[]
    const forest={ count:10,object:["wall","saintMary","wood","wood2"] , items:["tree","tree2","rock2","bush2","tree","tree2","tree","tree2"]}
    const field={ count:10,object:["scarcrow","hay","hay2","fence"] ,  items:["flower","flower2","flower3","crop","crop2","crop3","crop4","crop5","rock2",]}
    const graveyard={ count:6,object:["wall","grave5"] ,  items:["grave","grave2","grave3","grave4","grave5","saintMary"]}
    const plain={ count:10,object:["fireplace","scarcrow","bench"] ,  items:["tree","tree2","bush","bush2","bush3","rock","rock2","rock3","flower","flower2","flower3"]}
    const ruins={ count:10,object:["grave","grave2","grave3","grave4","saintMary"] ,  items:["wall","wall","wall","rock","rock2","rock3"]}
    const bush={ count:6,object:["saintMary","bench","fence"] ,  items:["bush","bush2","bush3","bush","bush2","bush3","rock"]}

//"tree","tree2","bush","bush2","bush3","rock","rock2","rock3","flower","flower2","flower3","crop","crop2","crop3","crop4","crop5"
// "saintMary","scarcrow","wall","bench","grave","grave2","grave3","grave4","grave5","fireplace","hay","hay2","wood","wood2","fence"
    bioms.push(forest,field,graveyard,plain,ruins,bush);
    const biom=bioms[getRandomInt(0, bioms.length - 1)]
    for (let i = 0; i < biom.count; i++) {
        natureData.push({
            type: biom.items[getRandomInt(0, biom.items.length - 1)],
            x:getRandomX(natureData,100),
            y:300,
        });
    }

    natureData.push({
        type: biom.object[getRandomInt(0, biom.object.length - 1)],
        x:getRandomX(natureData,50),
        y:300,
    });


    const levelData = {
        createdAt: new Date(),
        right:null,
        left:null,
        nature:natureData,
        enemies: enemiesData,
    };

    const levelId = await db.saveLevel(levelData);

    return { _id: levelId, ...levelData };
}
