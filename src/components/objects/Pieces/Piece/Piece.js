import { Object3D } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
        this.isChessPiece = true;
        this.captured = false;
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

            if (selected) {
                // If the piece is selected, enhance its emissive property
                o.material.emissive.setHex(0x444444); // Adjust the value as needed
                o.material.emissiveIntensity = 2; // Increase the emissive intensity
            } else {
                // If the piece is not selected, reset to default
                o.material.emissive.setHex(0x000000); // Reset to no emissive color
                o.material.emissiveIntensity = 0.5; // Reset to original emissive intensity
            }
        });
    }

    getCurrentTile(board) {
        return board.getTileByChessPosition(this.currChessPos);
    }

    update(chessPos) {}

    capture() {}

    reset(position) {
        this.position.copy(position);
        this.currentChessPos = this.intialChessPos;
    }
}

export default Piece;
