import { Object3D } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import {
    ChessConfig,
    ChessPosition,
    PIECE_TYPE,
    PIECE_COLOR,
} from '../../../../config';

class Piece extends Object3D {
    /**
     * @param {PIECE_TYPE} type
     * @param {GLTF} model
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} initialChessPosition
     * @param {Vector3} initialWorldPositon
     * @param {number} number - the number corresponds to the multiples of the piece type
     */
    constructor(
        type,
        model,
        color,
        initialChessPosition,
        initialWorldPositon,
        number
    ) {
        super();
        this.type = type;
        this.name = `${color}${type}${number}`;
        this.color = color;
        this.model = model;
        this.number = number;
        this.chessPosition = initialChessPosition;
        this.initialWorldPosition = initialWorldPositon;
        this.selected = false;
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

    select() {
        this.selected = true;
        this.traverse((o) => {
            if (!o.isMesh) return;

            // If the piece is selected, enhance its emissive property
            o.material.emissive.set(); // Adjust the value as needed
            o.material.emissiveIntensity = 2; // Increase the emissive intensity
        });
        this.position.y += 0.05;
    }

    deselect() {
        this.selected = false;
        this.traverse((o) => {
            if (!o.isMesh) return;

            // If the piece is not selected, reset to default
            o.material.emissive.setHex(0x000000); // Reset to no emissive color
            o.material.emissiveIntensity = 0.5; // Reset to original emissive intensity
        });
        this.position.y -= 0.05;
    }

    getCurrentTile(board) {
        return board.getTileByChessPosition(this.currChessPos);
    }

    move(worldPosition, chessPosition) {
        this.position.copy(worldPosition);
        this.chessPosition = chessPosition;
        this.selected = false;
    }

    capture() {
        // Move the piece to the captured position
        // shouldn't remove meshes from the scene as recreating them is expensive
        this.position.set(0, -10, 0);
        this.visible = false;

        // Mark the piece as captured
        this.captured = true;
    }

    isCaptured() {
        return this.captured;
    }

    reset() {
        // Reset the chess position of the piece to its initial position
        this.visible = true;
        this.position.copy(this.initialWorldPosition);
        this.captured = false;
    }
}

export default Piece;
