export default class Nature {
    static natureItems=[]

    static preloadAssets(scene){
        scene.load.image('tree', 'assets/Environment/tree.png');
        scene.load.image('tree2', 'assets/Environment/tree2.png');
        scene.load.image('bush', 'assets/Environment/bush.png');
        scene.load.image('bush2', 'assets/Environment/bush2.png');
        scene.load.image('bush3', 'assets/Environment/bush3.png');
        scene.load.image('rock', 'assets/Environment/rock.png');
        scene.load.image('rock2', 'assets/Environment/rock2.png');
        scene.load.image('rock3', 'assets/Environment/rock3.png');
        scene.load.image('saintMary', 'assets/Environment/saintMary.png');
        scene.load.image('scarcrow', 'assets/Environment/scarcrow.png');
        scene.load.image('wall', 'assets/Environment/wall.png');
        scene.load.image('grave', 'assets/Environment/grave.png');
        scene.load.image('grave2', 'assets/Environment/grave2.png');
        scene.load.image('bench', 'assets/Environment/bench.png');
        scene.load.image('flower', 'assets/Environment/flower.png');
        scene.load.image('flower2', 'assets/Environment/flower2.png');
        scene.load.image('flower3', 'assets/Environment/flower3.png');
        scene.load.image('crop', 'assets/Environment/crop.png');
        scene.load.image('crop2', 'assets/Environment/crop2.png');
        scene.load.image('crop3', 'assets/Environment/crop3.png');
        scene.load.image('crop4', 'assets/Environment/crop4.png');
        scene.load.image('crop5', 'assets/Environment/crop5.png');
        scene.load.image('grave3', 'assets/Environment/grave3.png');
        scene.load.image('grave4', 'assets/Environment/grave4.png');
        scene.load.image('grave5', 'assets/Environment/grave5.png');
        scene.load.image('fireplace', 'assets/Environment/fireplace.png');
        scene.load.image('hay', 'assets/Environment/hay.png');
        scene.load.image('hay2', 'assets/Environment/hay2.png');
        scene.load.image('wood', 'assets/Environment/wood.png');
        scene.load.image('wood2', 'assets/Environment/wood2.png');
        scene.load.image('fence', 'assets/Environment/fence.png');
    }

    static destroyNature(scene) {
        Nature.natureItems.forEach(natureItem => {
            natureItem.destroy();
        })
    }

    static loadNature(scene, nature) {
        nature.forEach(natureItem => {
            this.item = scene.physics.add.image(natureItem.x, natureItem.y, natureItem.type).setScale(0.7);
            this.item.setGravityY(50000);
            scene.physics.add.collider(this.item, scene.ground);
            Nature.natureItems.push(this.item)
        })
    }
}
