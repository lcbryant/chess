import MODEL from '../../../../assets/queen.glb';
import { ChessPosition, PIECE_COLOR, PIECE_TYPE } from '../../../../config';
import { Piece } from '../Piece';

class Queen extends Piece {
    /**
     * @param {PIECE_TYPE} type
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} initialPosition
     * @param {number} number
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
    }
}

export default Queen;
