import { Object3D } from 'three';
import { Box3 } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
    ChessConfig,
    ChessPosition,
    PIECE_TYPE,
    PIECE_COLOR,
} from '../../../config';

class Piece extends Object3D {
    /**
     * @param {PIECE_TYPE} type
     * @param {GLTF} model
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} initialPosition
     * @param {number} number - the number corresponds to the multiples of the piece type
     */
    constructor(type, model, color, initialPosition, number) {
        super();
        this.type = type;
        this.name = `${color}${type}${number}`;
        this.color = color;
        this.model = model;
        this.number = number;
        this.initChessPos = initialPosition;
        this.currChessPos = initialPosition;
        this.hitbox = new Box3();
        this.isChessPiece = true;
    }

    /**
     *  @param {GLTFLoader} loader
     *  @returns {Promise<GLTF>}
     */
    initModel(loader) {
        return new Promise((resolve, reject) => {
            loader.load(
                this.model,
                (gltf) => {
                    this.add(gltf.scene);
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

    setSelected(selected) {
        this.isSelected = selected;
        this.traverse((o) => {
            if (!o.isMesh) return;
            const color = selected
                ? 0xff0000
                : this.color === 'w'
                ? 0xffffff
                : 0x000000;
            console.log('Setting color for', o);
            o.material.color.set(color);
        });
    }

    update(chessPos) {}

    reset(position) {
        this.position.copy(position);
        this.currentChessPos = this.intialChessPos;
    }
}

export default Piece;
