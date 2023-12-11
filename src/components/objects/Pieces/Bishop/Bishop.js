import MODEL from '../../../../assets/bishop.glb';
import { Piece } from '../Piece';
import { PIECE_COLOR, PIECE_TYPE } from '../../../config';

class Bishop extends Piece {
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

export default Bishop;
