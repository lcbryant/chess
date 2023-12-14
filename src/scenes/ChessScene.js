import * as Dat from 'dat.gui';
import { BasicLights } from 'lights';
import { Board } from 'objects';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ChessGameEngine } from '../ChessGameEngine';
import { PieceGenerator } from '../PieceGenerator';
import { ChessController } from '../components/controllers';
import { ChessConfig } from '../config';

import {
    Scene,
    GridHelper,
    SpotLightHelper,
    PerspectiveCamera,
    Raycaster,
} from 'three';

class ChessScene extends Scene {
    constructor(renderer, loader) {
        super();
        this.renderer = renderer;
        this.loader = loader;

        this.state = {
            gui: new Dat.GUI(),
            rotationSpeed: 1,
            updateList: [],
        };

        this.background = ChessConfig.SCENE_BACKGROUND;

        const lights = new BasicLights();
        this.add(lights);
        this.initCamera(window.innerWidth / window.innerHeight);
        this.setUpWindowResizing();
        this.initControls(this.camera, renderer.domElement);
        this.initScene();
        this.initEngine();
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        this.orbitControls.update();
        for (const object of this.state.updateList) {
            object.update && object.update(timeStamp);
        }
        this.camera.updateProjectionMatrix();
        this.renderer.render(this, this.camera);
    }

    setUpWindowResizing() {
        const windowResizeHandler = () => {
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };

        windowResizeHandler();
        window.addEventListener('resize', windowResizeHandler, false);
    }

    setUpHelpers() {
        const gridHelper = new GridHelper(1, 16);
        this.add(gridHelper);
        const spotLight = this.children[0].children[0];
        const spotLightHelper = new SpotLightHelper(spotLight);
        this.add(spotLightHelper);
    }

    initCamera(aspectRatio) {
        this.camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
        this.camera.position.set(0, 0.5, 0.4);
        this.camera.lookAt(0, 0, 0);
    }

    initControls(camera, canvas) {
        // set up camera controls
        this.orbitControls = new OrbitControls(camera, canvas);
        this.orbitControlsenableDamping = true;
        this.orbitControls.enablePan = false;
        this.orbitControls.minDistance = 0.5;
        this.orbitControls.maxDistance = 1.0;
        this.orbitControls.update();

        // set up mouse controls
        this.raycaster = new Raycaster();
        this.chessController = new ChessController(
            this.camera,
            this,
            this.raycaster
        );
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

    initEngine() {
        this.engine = new ChessGameEngine();
    }
}

export default ChessScene;
