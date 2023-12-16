import { BasicLights } from "lights";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ChessGameEngine } from "../ChessGameEngine";
import { GameGUI } from "../GameGUI";
import { PieceGenerator } from "../PieceGenerator";
import { Board } from "../components/objects/Board";
import { ChessConfig, GameState } from "../config";

import {
    Scene,
    GridHelper,
    SpotLightHelper,
    PerspectiveCamera,
    Raycaster,
    Vector2,
} from 'three';

/**
 * ChessScene extends the Three.js Scene class, providing a 3D environment for a chess game.
 * It integrates various components like camera controls, game logic, and GUI elements.
 */
class ChessScene extends Scene {
    /**
     * Constructs a new ChessScene instance.
     *
     * @param {Renderer} renderer - The Three.js renderer.
     * @param {Loader} loader - The Three.js loader for loading external resources.
     */
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
            this.pieceGenerator,
            this.state
        );
    }

    /**
     * Adds an object to the update list for regular updates during the animation loop.
     *
     * @param {Object} object - The object to be added to the update list.
     */
    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    /**
     * The main update loop for the scene, called on each frame of the animation.
     * Updates camera controls, processes object updates, and renders the scene.
     *
     * @param {number} timeStamp - The current timestamp of the frame.
     */
    update(timeStamp) {
        if (this.state.gameStarted) {
            this.orbitControls.update();
            for (const object of this.state.updateList) {
                object.update && object.update(timeStamp);
            }
        }
        // would Ideally like to have this spinning but it causes the whiteTurnCamera and blackTurnCamera to be funky
        /*else {
            this.rotation.y = (timeStamp / 10000) * this.state.rotationSpeed;
        }*/

        this.camera.updateProjectionMatrix();
        this.renderer.render(this, this.camera);
    }

    /**
     * Initializes the GUI for the chess game.
     */
    initGui() {
        this.state.gui = new GameGUI(this.state);
        const button = this.state.gui.startGameButton();
        button.addEventListener('mousedown', this.startGame.bind(this), false);
    }

    /**
     * Starts the chess game, sets the game state to started, and configures the camera.
     *
     * @param {Event} event - The click event object associated with the start action.
     */
    startGame(event) {
        event.stopPropagation();
        this.state.gameStarted = true;
        this.state.gui.removeStartGameButton();
        this.whiteTurnCamera();

        // add in other gui elements
        const turnControlButtons = this.state.gui.turnControlButtons();
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

        this.state.gui.capturesGui();
        const { queenButton, rookButton, bishopButton, knightButton } =
            this.state.gui.promotionGui();

        queenButton.addEventListener(
            'mousedown',
            this.engine.handlePromotion.bind(this.engine, 'q'),
            false
        );

        rookButton.addEventListener(
            'mousedown',
            this.engine.handlePromotion.bind(this.engine, 'r'),
            false
        );

        bishopButton.addEventListener(
            'mousedown',
            this.engine.handlePromotion.bind(this.engine, 'b'),
            false
        );

        knightButton.addEventListener(
            'mousedown',
            this.engine.handlePromotion.bind(this.engine, 'n'),
            false
        );
    }

    /**
     * Callback function for undoing a move in the game.
     *
     * @param {Event} event - The event object associated with the undo move action.
     */
    undoMoveCallback(event) {
        event.stopPropagation();
        this.engine.undoMove();
    }

    /**
     * Callback function for ending a player's turn.
     *
     * @param {Event} event - The event object associated with the end turn action.
     */
    endTurnCallback(event) {
        event.stopPropagation();
        this.engine.endTurn();

        if (this.state.gameOver) {
            const button = this.state.gui.showGameOver();
            button.addEventListener(
                'mousedown',
                this.resetBoard.bind(this),
                false
            );
        }

        this.state.gui.hideTurnControlButtons();

        if (this.state.turn === 'w') this.whiteTurnCamera();
        else this.blackTurnCamera();
    }

    /**
     * Sets up window resizing handling to adjust the camera aspect ratio.
     */
    setUpWindowResizing() {
        const windowResizeHandler = () => {
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };

        windowResizeHandler();
        window.addEventListener('resize', windowResizeHandler, false);
    }

    /**
     * Sets up helpers like grid and spotlight helpers for the scene.
     */
    setUpHelpers() {
        const gridHelper = new GridHelper(1, 16);
        this.add(gridHelper);
        const spotLight = this.children[0].children[0];
        const spotLightHelper = new SpotLightHelper(spotLight);
        this.add(spotLightHelper);
    }

    /**
     * Initializes the scene camera with the specified aspect ratio.
     *
     * @param {number} aspectRatio - The aspect ratio for the camera.
     */
    initCamera(aspectRatio) {
        this.camera = new PerspectiveCamera(75, aspectRatio, 0.1, 100);
        this.camera.position.copy(ChessConfig.CAMERA_POSITION_WHITE);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Positions the camera for the white player's perspective.
     */
    whiteTurnCamera() {
        this.camera.position.copy(ChessConfig.CAMERA_POSITION_WHITE);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Positions the camera for the black player's perspective.
     */
    blackTurnCamera() {
        this.camera.position.copy(ChessConfig.CAMERA_POSITION_BLACK);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * Initializes the controls for the scene, such as orbit controls and mouse controls.
     *
     * @param {Camera} camera - The camera to attach the controls to.
     * @param {HTMLElement} canvas - The canvas element for the renderer.
     */
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

    /**
     * Calculates the mouse position in normalized device coordinates (NDC).
     *
     * @param {Event} event - The mouse event.
     */
    getMousePosition(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    /**
     * Handles mouse down events for the scene, including selecting pieces and tiles.
     *
     * @param {Event} event - The mouse down event.
     */
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
    }

    /**
     * Initializes the 3D chess scene, including setting up the board, lights, and pieces.
     */
    initScene() {
        const lights = new BasicLights();
        this.board = new Board(this.loader);
        this.pieceGenerator = new PieceGenerator(this.board, this.loader);
        this.pieceGenerator.initPieces();
        const pieces = this.pieceGenerator.getAllPieces();
        this.add(this.board, lights);
        for (const p of pieces) this.add(p);
    }

    /**
     * Resets the chess board to its initial state.
     */
    resetBoard() {
        // refresh the page
        location.reload();
        this.engine.resetGame();
    }
}

export default ChessScene;
