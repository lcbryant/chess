import MODEL from '../../../../assets/king.glb';
import { Piece } from '../Piece';
import { PIECE_COLOR, PIECE_TYPE } from '../../../config';

class King extends Piece {
    /**
     * @param {PIECE_TYPE} type
     * @param {PIECE_COLOR} color
     * @param {{string: number}} initialPosition
     * @param {number} number
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
    }
}

export default King;
