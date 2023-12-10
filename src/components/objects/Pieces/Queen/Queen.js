import MODEL from './queen.glb';
import { Piece } from '../Piece';

class Queen extends Piece {
    /**
     * @param {String} color
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'queen';
    }
}

export default Queen;