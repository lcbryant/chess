import MODEL from "../../../assets/board_base.glb";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Represents the base of the chessboard in the game. It extends Object3D to include
 * functionality for loading and displaying the base model.
 */
class BoardBase extends Object3D {
    /**
     * Constructs a new instance of BoardBase.
     *
     * @param {string} name - The name assigned to this instance of the board base.
     */
    constructor(name) {
        super();
        this.name = name;
    }

    /**
     * Initializes the 3D model of the board base.
     * Loads the model using the provided GLTFLoader and adds it to the current instance.
     *
     * @param {GLTFLoader} loader - The loader used to load the GLTF model.
     * @returns {Promise<GLTF>} A promise that resolves with the GLTF model once it is loaded.
     */
    initModel(loader) {
        return new Promise((resolve, reject) => {
            loader.load(
                MODEL,
                (gltf) => {
                    this.add(gltf.scene);
                    resolve(gltf);
                },
                undefined,
                (event) => {
                    reject(event);
                }
            );
        });
    }
}

export { BoardBase };
