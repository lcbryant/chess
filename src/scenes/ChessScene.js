import { BasicLights } from "lights";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ChessGameEngine } from "../ChessGameEngine";
import { GameGUI } from "../GameGUI";
import { PieceGenerator } from "../PieceGenerator";
import { Board } from "../components/objects/Board";
import { ChessConfig } from "../config";

import {
    Scene,
    GridHelper,
    SpotLightHelper,
    PerspectiveCamera,
    Raycaster,
    Vector2,
} from 'three';

class GameState {
    constructor() {
        this.updateList = [];
        this.gameStarted = false;
        this.turn = 'w';
        this.rotationSpeed = 1;
        this.whiteCaptures = [];
        this.blackCaptures = [];
        this.moveHistory = [];
        this.moveMade = false;
    }
}

class ChessScene extends Scene {
    constructor(renderer, loader) {
        super();
        this.renderer = renderer;
        this.loader = loader;
        this.mouse = new Vector2();

        this.state = new GameState();

        this.background = ChessConfig.SCENE_BACKGROUND;
        this.initScene();
        this.initCamera(window.innerWidth / window.innerHeight);
        this.initControls(this.camera, renderer.domElement);
        this.initGui();
        this.setUpWindowResizing();
        this.engine = new ChessGameEngine(
            this.board,
            this.pieceGenerator.getAllPieces(),
            this.state
        );
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        if (this.state.gameStarted) {
            this.orbitControls.update();
            for (const object of this.state.updateList) {
                object.update && object.update(timeStamp);
            }
        } else {
            this.rotation.y = (timeStamp / 10000) * this.state.rotationSpeed;
        }

        this.camera.updateProjectionMatrix();
        this.renderer.render(this, this.camera);
    }

    initGui() {
        this.gui = new GameGUI(this.state);
        const button = this.gui.startGameButton();
        button.addEventListener('mousedown', this.startGame.bind(this), false);
    }

    startGame(event) {
        event.stopPropagation();
        this.state.gameStarted = true;
        this.gui.removeStartGameButton();
        this.whiteTurnCamera();
        // add in other gui elements
        const turnControlButtons = this.gui.turnControlButtons();
        const [undoMoveButton, endTurnButton] = turnControlButtons.children;
        undoMoveButton.addEventListener(
            'mousedown',
            this.undoMoveCallback.bind(this),
            false
        );
        endTurnButton.addEventListener(
            'mousedown',
            this.endTurnCallback.bind(this),
            false
        );
    }

    undoMoveCallback(event) {
        event.stopPropagation();
        this.engine.undoMove();
    }

    endTurnCallback(event) {
        event.stopPropagation();
        this.engine.endTurn();
        this.gui.hideTurnControlButtons();
        if (this.state.turn === 'w') this.whiteTurnCamera();
        else this.blackTurnCamera();
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
        this.camera.position.copy(ChessConfig.CAMERA_POSITION_WHITE);
        this.camera.lookAt(0, 0, 0);
    }

    whiteTurnCamera() {
        this.camera.position.copy(ChessConfig.CAMERA_POSITION_WHITE);
        this.camera.lookAt(0, 0, 0);
    }

    blackTurnCamera() {
        this.camera.position.copy(ChessConfig.CAMERA_POSITION_BLACK);
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
        window.addEventListener(
            'mousedown',
            this.onMouseDown.bind(this),
            false
        );
    }

    // Calculates the mouse position in NDC
    getMousePosition(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        if (event.button === 2) this.engine.deselectPiece(); // right click

        this.getMousePosition(event);
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.children, true);

        if (!intersects.length) return;

        const clickedObject = intersects[0].object;

        if (!!clickedObject.userData.isTile) {
            this.engine.handleTileClick(clickedObject);
        } else if (!!clickedObject.userData.lastParent) {
            this.engine.handlePieceClick(clickedObject.userData.lastParent);
        }

        if (this.state.moveMade) {
            this.gui.showTurnControlButtons();
        }
    }

    initScene() {
        const lights = new BasicLights();
        this.board = new Board(this.loader);
        this.pieceGenerator = new PieceGenerator(this.board, this.loader);
        this.pieceGenerator.initPieces();
        const pieces = this.pieceGenerator.getAllPieces();
        this.add(this.board, lights);
        for (const p of pieces) this.add(p);
    }

    resetBoard() {
        // refresh the page
        location.reload();
    }
}

export default ChessScene;
