import MODEL from "../../../assets/board_base.glb";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class BoardBase extends Object3D {
    constructor(name) {
        super();
        this.name = name;
    }

    /**
     *  @param {GLTFLoader} loader
     *  @returns {Promise<GLTF>}
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
