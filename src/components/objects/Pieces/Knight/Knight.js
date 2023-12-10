import MODEL from './knight.glb';
import { Piece } from '../Piece';

class Knight extends Piece {
    /**
     * @param {String} color
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'pawn';
    }
}

export default Knight;