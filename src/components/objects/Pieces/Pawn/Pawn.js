import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './pawn.glb';

class Pawn extends Group {
    /**
     * @param {String} color
     */
    constructor(color, number) {
        super();

        const loader = new GLTFLoader();

        this.name = 'pawn';
        this.color = color;
        this.number = number;

        loader.load(
            MODEL,
            (gltf) => {
                const c = color === 'w' ? 0x808080 : 0x0f0f0f;
                console.log(gltf.scene.children[0].material.color.setHex(c));
                this.add(gltf.scene);
            },
            undefined,
            (error) => console.error(error)
        );
    }
}

export default Pawn;
