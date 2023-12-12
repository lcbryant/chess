import * as Dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Scene, Color, GridHelper, SpotLightHelper, Raycaster } from 'three';
import { Board, PieceGenerator } from 'objects';
import { BasicLights } from 'lights';

class ChessScene extends Scene {
    constructor() {
        super();

        this.loader = new GLTFLoader();

        this.state = {
            gui: new Dat.GUI(),
            rotationSpeed: 1,
            updateList: [],
        };

        this.background = new Color(0x000000);

        const lights = new BasicLights();
        this.add(lights);
        this.initScene();
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {}

    setUpHelpers() {
        const gridHelper = new GridHelper(1, 16);
        this.add(gridHelper);
        const spotLight = this.children[0].children[0];
        const spotLightHelper = new SpotLightHelper(spotLight);
        this.add(spotLightHelper);
    }

    initScene() {
        const board = new Board(this.loader);
        this.add(board);
        this.pieceContainer = new PieceGenerator(board, this.loader);
        this.pieceContainer.initPieces();
        for (const p of this.pieceContainer.getAllPieces()) {
            this.add(p);
        }
    }
}

export default ChessScene;
