import { Chess, Piece } from 'chess.js';

/**
 * The ChessGameEngine class is responsible for managing the state of the chess game.
 */
class ChessGameEngine {
    /**
     * @param {GLTFLoader} loader
     */
    constructor() {
        this.gameInstance = new Chess();
    }

    /**
     * @param {string} from
     * @param {string} to
     * @returns
     */
    move(from, to) {
        try {
            const move = this.gameInstance.move({ from, to });
            return move;
        } catch (error) {
            console.log(error);
        }
    }

    moveNumber() {
        return this.gameInstance.moveNumber();
    }

    /**
     * @param {string} piece the type of piece, found in ChessConfig
     * @param {string} square the algebraic notation of the square
     * @returns
     */
    legalMoves(piece, square) {
        return this.gameInstance.moves({ piece, square });
    }

    /**
     * @returns {string} the current turn, either 'w' or 'b'
     */
    currentTurn() {
        return this.gameInstance.turn();
    }
}

export default ChessGameEngine;
