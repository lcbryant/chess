import { Group } from 'three';
import { Color, MeshPhongMaterial, Box3 } from 'three';
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
        this.color = color;
        this.model = model;
        this.number = number;
        this.colorHex = color === 'w' ? HEX_W : HEX_B;
        this.hitbox = new Box3();

        loader.load(
            model,
            (gltf) => {
                this.mesh = gltf.scene.children[0];
                this.changeMaterial();
                // rotate the black pieces 180 degrees
                if (this.color === 'b') this.mesh.rotateY(Math.PI);
                // create the hitbox for the piece
                this.hitbox.setFromObject(this.mesh);
                this.add(gltf.scene);
            },
            undefined,
            (error) => console.error(error)
        );
    }

    changeMaterial() {
        this.mesh.traverse((o) => {
            if (!o.isMesh) {
                return;
            }

            o.userData.lastParent = this;

            o.castShadow = true;
            o.receiveShadow = true;

            const color = new Color().setHex(this.colorHex);

            color.convertSRGBToLinear();
            o.material = new MeshPhongMaterial({
                color,
            });
        });
    }
}

export default Piece;
