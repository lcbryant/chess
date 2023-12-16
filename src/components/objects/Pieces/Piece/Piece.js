import { Object3D } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChessConfig, ChessPosition } from "../../../../config";

/**
 * Represents a chess piece in the game. It includes properties for the piece's type,
 * color, position, and state, and methods for initializing the 3D model, selection,
 * movement, and capture.
 */
class Piece extends Object3D {
    /**
     * Constructs a Piece instance.
     *
     * @param {string} type - The type of the chess piece (e.g., 'p' for Pawn).
     * @param {GLTF} model - The 3D model of the chess piece.
     * @param {string} color - The color of the chess piece ('w' for white, 'b' for black).
     * @param {ChessPosition} initialChessPosition - The initial chess position on the board.
     * @param {Vector3} initialWorldPositon - The initial position in world coordinates.
     * @param {number} number - Identifier for the piece, especially for distinguishing multiple pieces of the same type.
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
     * Initializes the 3D model of the chess piece.
     *
     * @param {GLTFLoader} loader - The loader to use for loading the model.
     * @returns {Promise<GLTF>} A promise that resolves with the loaded model.
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

    /**
     * Changes the material of the chess piece based on its color.
     */
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
                    ? ChessConfig.lightPieceMaterial
                    : ChessConfig.darkPieceMaterial;
        });
    }

    /**
     * Marks the chess piece as selected, visually enhancing its appearance.
     */
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

    /**
     * Marks the chess piece as deselected, reverting any visual enhancements.
     */
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

    /**
     * Gets the current tile on which the chess piece is placed.
     *
     * @param {Board} board - The board to which the piece belongs.
     * @returns {Mesh} The current tile mesh.
     */
    getCurrentTile(board) {
        return board.getTileByChessPosition(this.currChessPos);
    }

    /**
     * Moves the chess piece to a new position.
     *
     * @param {Vector3} worldPosition - The new position in world coordinates.
     * @param {ChessPosition} chessPosition - The new chess position on the board.
     */
    move(worldPosition, chessPosition) {
        this.position.copy(worldPosition);
        this.chessPosition = chessPosition;
        this.selected = false;
    }

    /**
     * Captures the chess piece, visually indicating its removal from play.
     */
    capture() {
        // Move the piece to the captured position
        // shouldn't remove meshes from the scene as recreating them is expensive
        this.position.set(0, -10, 0);
        this.visible = false;

        // Mark the piece as captured
        this.captured = true;
    }

    /**
     * Checks if the chess piece has been captured.
     *
     * @returns {boolean} True if the piece is captured, false otherwise.
     */
    isCaptured() {
        return this.captured;
    }

    /**
     * Resets the chess piece to its initial state and position.
     *
     * @param {Vector3} worldPosition - The new position in world coordinates.
     * @param {ChessPosition} chessPosition - The new chess position on the board.
     */
    reset(worldPosition, chessPosition) {
        // Reset the chess position of the piece to its initial position
        this.visible = true;
        this.position.copy(worldPosition);
        this.chessPosition = chessPosition;
        this.captured = false;
    }
}

export default Piece;
