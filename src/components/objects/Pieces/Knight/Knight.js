import MODEL from '../../../../assets/knight.glb';
import { Piece } from '../Piece';
import { ChessPosition, PIECE_COLOR, PIECE_TYPE } from '../../../config';

class Knight extends Piece {
    /**
     * @param {PIECE_TYPE} type
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} initialPosition
     * @param {number} number
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'knight';
        this.isChessPiece = true;
        // Assuming initialPosition is an object with x and y properties
        this.chessPosition = initialPosition;
    }
}

export default Knight;
