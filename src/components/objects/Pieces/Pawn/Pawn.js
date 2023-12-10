import MODEL from '../../../../assets/pawn.glb';
import { Piece } from '../Piece';

class Pawn extends Piece {
    /**
     * @param {String} color
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'pawn';
    }
}

export default Pawn;
