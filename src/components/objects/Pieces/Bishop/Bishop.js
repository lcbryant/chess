import MODEL from '../../../../assets/bishop.glb';
import { Piece } from '../Piece';

class Bishop extends Piece {
    /**
     * @param {String} color
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'bishop';
    }
}

export default Bishop;