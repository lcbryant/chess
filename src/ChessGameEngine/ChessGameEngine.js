import { Chess } from "chess.js";
import { Board, Piece } from "objects";

/**
 * The ChessGameEngine class is responsible for managing the state of the chess game.
 */
class ChessGameEngine {
    /**
     * @param {Board} board
     * @param {Array<Piece>} pieces
     */
    constructor(board, pieces, state) {
        this.gameInstance = new Chess();
        this.board = board;
        this.pieces = pieces;
        this.state = state;
        this.selectedPiece = null;
    }

    anyPieceSelected() {
        return !!this.selectedPiece;
    }

    /**
     * Scenarios: piece is selected, piece is not selected
     * If a piece is selected, and the user clicks on another piece
     * of their own color, then the new piece is selected.
     * If a piece is selected, and the user clicks on a legal tile, then
     * the selected piece is moved to the tile.
     * If a piece is selected, and the user clicks on the same piece,
     * then the piece is deselected.
     * If a piece is selected, and the user clicks on a piece
     * of the opposite color that is a legal move, then the piece
     * is moved to the tile and the opposite piece is captured.
     * If a piece is selected, and the user clicks on a piece
     * of the opposite color that is not a legal move, then nothing
     * happens.
     * If a piece is selected, and the user clicks on an illegal tile,
     * then nothing happens.
     * If a piece is not selected, and the user clicks on a piece
     * of their own color, then the piece is selected.
     * If a piece is not selected, and the user clicks on a tile,
     * then nothing happens.
     */

    handlePieceClick(piece) {
        if (this.anyPieceSelected()) {
            if (piece === this.selectedPiece) {
                this.deselectPiece();
            } else if (piece.color === this.selectedPiece.color) {
                this.deselectPiece();
                this.selectPiece(piece);
            } else {
                const tile = this.board.getTileByChessPosition(
                    piece.chessPosition
                );
                this.handlePieceMove(tile, piece);
            }
        } else {
            this.selectPiece(piece);
        }
    }

    handleTileClick(tile) {
        if (!this.anyPieceSelected()) return;

        const found = this.board.markedTiles.find(
            (ele) => ele.userData.chessPosition === tile.userData.chessPosition
        );

        if (!found) return;

        this.handlePieceMove(tile);
    }

    /**
     * @param {*} piece - the piece to select
     */
    selectPiece(piece) {
        if (piece.color !== this.currentTurn()) return;

        const legalMoves = this.legalMoves(
            piece.type,
            piece.chessPosition.toAlgebraicNotation()
        );

        if (!legalMoves.length) return;

        this.selectedPiece = piece;
        piece.select();

        legalMoves.forEach((move) => {
            const tile = this.board.getTileByAlgebraicNotation(move);
            this.board.markTile(tile);
        });
    }

    deselectPiece() {
        if (!this.selectedPiece) return;
        this.selectedPiece.deselect();
        this.board.unmarkTiles();
        this.selectedPiece = null;
    }

    /**
     * Scenarios: tile is empty, tile is occupied by a piece of the opposite color
     * Tile is empty: move the piece to the tile
     * Tile is occupied by a piece of the opposite color: move the piece to the tile
     * and capture the piece
     *
     * Already validated that the move is legal, so no need to check again
     */
    /**
     * @param {*} tile - the tile to move to
     * @param {*} piece - the piece occupying the tile
     */
    handlePieceMove(tile, piece) {
        if (!!piece) {
            this.capturePiece(piece);
        }

        this.movePiece(tile);
    }

    movePiece(tile) {
        const move = this.gameInstance.move({
            from: this.selectedPiece.chessPosition.toAlgebraicNotation(),
            to: tile.userData.chessPosition.toAlgebraicNotation(),
        });

        if (!move) return;

        this.selectedPiece.move(tile.position, tile.userData.chessPosition);
        this.board.unmarkTiles();
        this.selectedPiece = null;
        this.state.moveMade = true;
    }

    /**
     * @param {*} piece - the piece to capture
     */
    capturePiece(piece) {
        this.pieces = this.pieces.filter((ele) => ele !== piece);
        piece.capture();
        if (piece.color === 'w') {
            this.state.blackCaptures.push(piece);
        } else {
            this.state.whiteCaptures.push(piece);
        }
    }

    undoMove() {
        const lastMove = this.gameInstance.undo();
        console.log(lastMove);
        this.state.moveMade = false;
    }

    endTurn() {
        this.state.moveMade = false;
        this.state.turn = this.currentTurn();
    }

    moveNumber() {
        return this.gameInstance.moveNumber();
    }

    /**
     * @param {string} pieceType the type of piece, found in ChessConfig
     * @param {string} square the algebraic notation of the square
     * @returns
     */
    legalMoves(pieceType, square) {
        const moves = this.gameInstance.moves({
            pieceType,
            square,
            verbose: true,
        });
        return moves.map((move) => move.to);
    }

    /**
     * @returns {string} the current turn, either 'w' or 'b'
     */
    currentTurn() {
        return this.gameInstance.turn();
    }
}

export default ChessGameEngine;
