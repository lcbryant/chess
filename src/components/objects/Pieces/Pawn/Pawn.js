import MODEL from '../../../../assets/pawn.glb';
import { Piece } from '../Piece';
import { ChessPosition, PIECE_COLOR, PIECE_TYPE } from '../../../config';

class Pawn extends Piece {
    /**
     * @param {PIECE_TYPE} type
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} initialPosition
     * @param {number} number
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'pawn';

    }
}

export default Pawn;
