import { Group } from 'three';
import { Color, Mesh, MeshPhongMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const PIECE_COLOR = 'w' | 'b';
const PIECE_TYPE = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
const HEX_W = 0x808080;
const HEX_B = 0x0f0f0f;

class Piece extends Group {
    /**
     * @param {PIECE_TYPE} type
     * @param {*} model
     * @param {PIECE_COLOR} color
     * @param {*} initialPosition
     */
    constructor(type, model, color, initialPosition, number) {
        super();

        const loader = new GLTFLoader();

        this.type = type;
        this.model = model;
        this.color = color;
        this.number = number;
        this.colorHex = color === 'w' ? HEX_W : HEX_B;

        loader.load(
            model,
            (gltf) => {
                gltf.scene.children[0].material.color.setHex(this.colorHex);
                // rotate the black pieces 180 degrees
                if (this.color === 'b') gltf.scene.children[0].rotateY(Math.PI);
                this.add(gltf.scene);
            },
            undefined,
            (error) => console.error(error)
        );
    }
}

export default Piece;
