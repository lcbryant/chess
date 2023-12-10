import MODEL from '../../../../assets/rook.glb';
import { Piece } from '../Piece';

class Rook extends Piece {
    /**
     * @param {String} color
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'rook';
    }
}

export default Rook;
