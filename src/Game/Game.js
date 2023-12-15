import "../static/styles.css";
import { LoadingManager, ReinhardToneMapping, WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChessScene } from "../scenes";

/**
 * Core game class that initializes and handles the renderer, scene, and game loop
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

    initLoader() {
        const loadingManager = new LoadingManager();
        loadingManager.onLoad = () => {
            console.log('Loading complete!');
        };
        this.loader = new GLTFLoader(loadingManager);
    }

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

    setUpWindowResizing() {
        const windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            this.renderer.setSize(innerWidth, innerHeight);
        };

        windowResizeHandler();
        window.addEventListener('resize', windowResizeHandler, false);
    }

    initChessScene() {
        return new ChessScene(this.renderer, this.loader);
    }

    updateGame(timeStamp) {
        this.activeScene.update(timeStamp);
    }

    update(timeStamp) {
        try {
            this.updateGame(timeStamp);
        } catch (error) {
            console.error(error);
        }
    }
}

export default Game;
