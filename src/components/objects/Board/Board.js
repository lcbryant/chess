import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from '../../../assets/board.glb';

class Board extends Group {
    constructor() {
        super();

        const loader = new GLTFLoader();

        this.name = 'board';
        loader.load(
            MODEL,
            (gltf) => {
                this.add(gltf.scene);
                this.model = gltf;
            },
            undefined,
            (error) => console.error(error)
        );
    }
}

export default Board;
