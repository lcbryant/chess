import MODEL from '../../../../assets/king.glb';
import { Piece } from '../Piece';

class King extends Piece {
    /**
     * @param {String} color
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'king';
    }
}

export default King;