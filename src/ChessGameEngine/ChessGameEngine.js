import { Chess } from "chess.js";
import { Board, Piece } from "objects";
import { GameState } from "../config";

/**
 * ChessGameEngine is responsible for managing the state and interactions of a 3D chess game.
 * It integrates with the chess.js library to handle game logic and manages the 3D representation of the game.
 */
class ChessGameEngine {
    /**
     * Constructs a new ChessGameEngine instance.
     *
     * @param {Board} board The 3D chess board.
     * @param {Array<Piece>} pieces The array of chess pieces.
     * @param {GameState} state The game state object to track captures, turns, and moves.
     */
    constructor(board, pieces, state) {
        this.gameInstance = new Chess();
        this.board = board;
        this.pieces = pieces;
        this.state = state;
        this.selectedPiece = null;
        this.selectedPieceStartingWorldPosition = null;
    }

    /**
     * Checks if any piece is currently selected.
     *
     * @returns {boolean} True if a piece is selected, false otherwise.
     */
    anyPieceSelected() {
        return !!this.selectedPiece;
    }

    /**
     * Handles the logic for when a chess piece is clicked. This method controls
     * the selection, deselection, and movement of pieces based on various scenarios.
     *
     * @param {Piece} piece The piece that was clicked.
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
     * Selects a piece on the board. This method highlights possible legal moves
     * for the selected piece and updates the game state accordingly.
     *
     * @param {Piece} piece The piece to be selected.
     */
    selectPiece(piece) {
        if (piece.color !== this.currentTurn()) return;

        const legalMoves = this.legalMoves(
            piece.type,
            piece.chessPosition.toAlgebraicNotation()
        );

        if (!legalMoves.length) return;

        this.selectedPiece = piece;
        this.selectedPieceStartingWorldPosition = piece.position.clone();
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
        this.selectedPieceStartingWorldPosition = null;
    }

    /**
     * Handles the movement of a piece to a tile. This method manages both simple moves
     * and captures, updating the game state as needed.
     *
     * @param {Tile} tile The tile to move the piece to.
     * @param {Piece} piece (optional) The piece occupying the target tile, if any.
     */
    handlePieceMove(tile, piece) {
        if (!!piece) {
            this.capturePiece(piece);
        }

        this.movePiece(tile);
    }

    /**
     * Executes the actual movement of a piece on the board.
     * This method updates the 3D position of the piece and the internal game state.
     *
     * @param {Tile} tile The destination tile for the moving piece.
     */
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
     * Captures a piece on the board. This method updates the game state to reflect the capture
     * and handles the removal or repositioning of the captured piece in the 3D environment.
     *
     * @param {Piece} piece The piece to be captured.
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

    /**
     * Undoes the last move made. This can be used to reverse actions if a player wishes
     * to take back their last move. It updates both the 3D environment and the game state.
     */
    undoMove() {
        if (!this.state.moveMade) return;
        const lastMove = this.gameInstance.undo();
        if (!lastMove) return false;
        const piece = this.pieces.find(
            (ele) =>
                ele.chessPosition.toAlgebraicNotation() === lastMove.to &&
                ele.color === lastMove.color
        );
        const fromPosition = this.board.algebraicToIndices(lastMove.from);

        piece.move(this.selectedPieceStartingWorldPosition, fromPosition);
        this.state.moveMade = false;
        this.selectedPieceStartingWorldPosition = null;

        if (lastMove.captured) {
            let capturedPiece = null;
            if (lastMove.color === 'w') {
                capturedPiece = this.state.whiteCaptures.pop();
            } else {
                capturedPiece = this.state.blackCaptures.pop();
            }

            const toPosition = this.board.getTileByAlgebraicNotation(
                lastMove.to
            );

            capturedPiece.reset();
            capturedPiece.move(
                toPosition.position,
                toPosition.userData.chessPosition
            );
        }
    }

    /**
     * Ends the current player's turn and updates the game state for the next player.
     * This method is crucial for turn-based gameplay.
     */
    endTurn() {
        this.state.moveMade = false;
        this.selectedPieceStartingWorldPosition = null;
        this.state.turn = this.currentTurn();
    }

    /**
     * Retrieves the current move number in the game.
     *
     * @returns {number} The current move number.
     */
    moveNumber() {
        return this.gameInstance.moveNumber();
    }

    /**
     * Calculates the legal moves for a given piece at a specific position.
     * This method uses chess.js to determine legal moves according to chess rules.
     *
     * @param {string} pieceType The type of the piece (e.g., 'pawn', 'knight').
     * @param {string} square The current position of the piece in algebraic notation.
     * @returns {Array<string>} An array of legal moves in algebraic notation.
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
     * Gets the color of the player whose turn it is.
     *
     * @returns {string} The current player's turn ('w' for white, 'b' for black).
     */
    currentTurn() {
        return this.gameInstance.turn();
    }
}

export default ChessGameEngine;
