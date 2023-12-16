import "../static/styles.css";
import { LoadingManager, ReinhardToneMapping, WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChessScene } from "../scenes";

/**
 * The main game class responsible for initializing and managing the core components
 * of the THREE CHESS game, including the renderer, scene, and the main game loop.
 */
class Game {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.initRenderer();
        this.initLoader();
        this.setUpWindowResizing();
        this.activeScene = this.initChessScene();
    }

    /**
     * Initializes the GLTF loader with a loading manager.
     * Sets up a callback for when all assets are loaded.
     */
    initLoader() {
        const loadingManager = new LoadingManager();
        loadingManager.onLoad = () => {
            console.log('Loading complete!');
        };
        this.loader = new GLTFLoader(loadingManager);
    }

    /**
     * Initializes the WebGL renderer with necessary settings for optimal
     * visual quality and performance.
     */
    initRenderer() {
        this.renderer = new WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
        });
        const canvas = this.renderer.domElement;
        document.body.appendChild(canvas);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.gammaFactor = 2.2;
        this.renderer.toneMapping = ReinhardToneMapping;
        this.renderer.toneMappingExposure = 5;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = 2;
    }

    /**
     * Sets up a handler to adjust the renderer's size when the window is resized,
     * ensuring the game display adapts responsively to the browser window size.
     */
    setUpWindowResizing() {
        const windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            this.renderer.setSize(innerWidth, innerHeight);
        };

        windowResizeHandler();
        window.addEventListener('resize', windowResizeHandler, false);
    }

    /**
     * Initializes the chess scene, which includes the chessboard, pieces, lights,
     * and other necessary elements for the game's 3D environment.
     *
     * @returns {ChessScene} The initialized ChessScene instance.
     */
    initChessScene() {
        return new ChessScene(this.renderer, this.loader);
    }

    /**
     * Updates the game logic, including the scene's state, based on the given timestamp.
     * This is typically called on each frame of the animation loop.
     *
     * @param {number} timeStamp The timestamp for the current frame, provided by the requestAnimationFrame.
     */
    updateGame(timeStamp) {
        this.activeScene.update(timeStamp);
    }

    /**
     * The main update loop called for each animation frame. Handles the game update
     * and catches any errors that occur during the game update.
     *
     * @param {number} timeStamp The timestamp for the current frame.
     */
    update(timeStamp) {
        try {
            this.updateGame(timeStamp);
        } catch (error) {
            console.error(error);
        }
    }
}

export default Game;
