import MODEL from "../../../../assets/pawn.glb";
import { ChessPosition, PIECE_COLOR, PIECE_TYPE } from "../../../../config";
import { Piece } from "../Piece";

class Pawn extends Piece {
    /**
     * @param {string} type - The type of piece. 'p' for pawn.
     * @param {string} color - The color of the piece. 'w' for white, 'b' for black.
     * @param {ChessPosition} initialPosition - The initial position of the piece on the board.
     * @param {number} number - The number of the piece. 1 for the first piece of its type.
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
    }

    promote(type) {
        this.promoted = true;
        this.promotedTo = type;
    }
}

export default Pawn;
