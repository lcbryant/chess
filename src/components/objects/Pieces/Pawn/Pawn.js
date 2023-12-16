import MODEL from "../../../../assets/pawn.glb";
import { ChessPosition, PIECE_COLOR, PIECE_TYPE } from "../../../../config";
import { Piece } from "../Piece";

class Pawn extends Piece {
    /**
     * @param {PIECE_TYPE} type
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} initialPosition
     * @param {number} number
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
