import MODEL from '../../../../assets/king.glb';
import { Piece } from '../Piece';
import { ChessPosition, PIECE_COLOR, PIECE_TYPE } from '../../../config';

class King extends Piece {
    /**
     * @param {PIECE_TYPE} type
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} initialPosition
     * @param {number} number
     */
    constructor(type, color, initialPosition, number) {
        super(type, MODEL, color, initialPosition, number);
        this.name = 'king';
        this.isChessPiece = true;
        // Assuming initialPosition is an object with x and y properties
        this.chessPosition = initialPosition;
    }
}

export default King;
