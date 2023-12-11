import { Object3D } from 'three';
import { Box3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { ChessConfig, PIECE_TYPE, PIECE_COLOR } from '../../../config';

class Piece extends Object3D {
    /**
     * @param {PIECE_TYPE} type
     * @param {GLTF} model
     * @param {PIECE_COLOR} color
     * @param {{string: number}} initialPosition
     * @param {number} number - the number corresponds to the multiples of the piece type
     */
    constructor(type, model, color, initialPosition, number) {
        super();

        const loader = new GLTFLoader();

        this.type = type;
        this.name = `${color}${type}${number}`;
        this.color = color;
        this.model = model;
        this.number = number;
        this.chessPos = initialPosition;
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

    /**
     *  @param {GLTFLoader} loader
     *  @returns {Promise<GLTF>}
     */
    initModel(loader) {
        return new Promise((resolve, reject) => {
            loader.load(
                this.modelName,
                (gltf) => {
                    this.add(gltf.scene);
                    this.model = gltf;
                    this.mesh = gltf.scene.children[0];
                    this.changeMaterial();
                    if (this.color === 'b') this.mesh.rotateY(Math.PI);
                    this.hitbox.setFromObject(this.mesh);
                    resolve(gltf);
                },
                undefined,
                (event) => {
                    reject(event);
                }
            );
        });
    }

    changeMaterial() {
        this.mesh.traverse((o) => {
            if (!o.isMesh) {
                return;
            }

            o.userData.lastParent = this;

            o.castShadow = true;
            o.receiveShadow = true;

            o.material =
                this.color === 'w'
                    ? ChessConfig.PIECE_WHITE_MATERIAL
                    : ChessConfig.PIECE_BLACK_MATERIAL;
        });
    }
}

export default Piece;
