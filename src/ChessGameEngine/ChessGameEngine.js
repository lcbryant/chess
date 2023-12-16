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
     * @param {PieceGenerator} pieceGenerator The piece generator for creating chess pieces.
     * @param {GameState} state The game state object to track captures, turns, and moves.
     */
    constructor(board, pieceGenerator, state) {
        this.gameInstance = new Chess();
        this.board = board;
        this.pieceGenerator = pieceGenerator;
        this.pieces = pieceGenerator.getAllPieces();
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
        if (this.state.moveMade) return;

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
                this.handlePieceMove(tile);
            }
        } else {
            this.selectPiece(piece);
        }
    }

    handleTileClick(tile) {
        if (this.state.moveMade) return;

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
     */
    handlePieceMove(tile) {
        const found = this.board.markedTiles.find(
            (ele) => ele.userData.chessPosition === tile.userData.chessPosition
        );

        if (!found) return;

        const fromTile = this.selectedPiece.chessPosition.toAlgebraicNotation();
        const toTile = tile.userData.chessPosition.toAlgebraicNotation();

        this.state.moveMade = { from: fromTile, to: toTile, promotion: null };

        if (this.isPromotion(fromTile, toTile)) {
            this.state.gui.showPromotionGui();
            return;
        }

        this.movePiece();
    }

    isPromotion(fromTile, toTile) {
        if (this.selectedPiece.type !== 'p') return false;

        const fromRank = parseInt(fromTile[1]);

        if (this.selectedPiece.color === 'w') {
            return fromRank === 7 && toTile[1] === '8';
        }

        return fromRank === 2 && toTile[1] === '1';
    }

    handlePromotion(type) {
        this.selectedPiece.promote(type);
        this.state.moveMade.promotion = type;
        this.selectedPiece.promote(type);
        this.state.gui.hidePromotionGui();
        this.movePiece();
    }

    /**
     * Executes the actual movement of a piece on the board.
     * This method updates the 3D position of the piece and the internal game state.
     */
    movePiece() {
        const str = `${this.state.moveMade.from}${this.state.moveMade.to}`;
        const move = this.gameInstance.move(str, { sloppy: true });

        if (!move) return;

        const tile = this.board.getTileByAlgebraicNotation(move.to);

        if (move.captured) {
            const capturedPiece = this.pieces.find(
                (ele) =>
                    ele.chessPosition.toAlgebraicNotation() === move.to &&
                    ele.color !== move.color
            );
            this.capturePiece(capturedPiece);
        }

        this.selectedPiece.move(tile.position, tile.userData.chessPosition);
        this.board.unmarkTiles();
        this.selectedPiece = null;
        this.state.gui.showTurnControlButtons();
    }

    /**
     * Captures a piece on the board. This method updates the game state to reflect the capture
     * and handles the removal or repositioning of the captured piece in the 3D environment.
     *
     * @param {Piece} piece The piece to be captured.
     */
    capturePiece(piece) {
        piece.capture();
        const capturerColor = piece.color === 'w' ? 'b' : 'w';
        this.state.captures[capturerColor].push(piece);
        this.state.gui.addCapture(piece);
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
        this.state.moveMade = null;
        this.selectedPieceStartingWorldPosition = null;

        if (lastMove.captured) {
            console.log(this.state.captures);
            const capturedPiece = this.state.captures[lastMove.color].pop();

            const toPosition = this.board.getTileByAlgebraicNotation(
                lastMove.to
            );

            capturedPiece.reset();
            capturedPiece.move(
                toPosition.position,
                toPosition.userData.chessPosition
            );

            this.state.gui.removeCapture(capturedPiece);
        }
    }

    /**
     * Ends the current player's turn and updates the game state for the next player.
     * This method is crucial for turn-based gameplay.
     */
    endTurn() {
        this.selectedPieceStartingWorldPosition = null;
        this.evaluateGameState();
    }

    evaluateGameState() {
        if (this.gameInstance.inCheck()) {
            // notify player that they are in check
            // only allow moves that get them out of check
            this.state.inCheck = this.currentTurn();
        } else if (this.gameInstance.isGameOver()) {
            // notify player that the game is over
            // display winner
            this.handleGameOver();
        } else {
            this.state.inCheck = null;
        }

        this.state.moveMade = null;
        this.state.turn = this.currentTurn();
        this.state.moveHistory.push(this.gameInstance.history());
    }

    handleGameOver() {
        this.state.gameOver = true;
        if (this.gameInstance.isCheckmate()) {
            this.state.winCondition = 'checkmate';
        } else if (this.gameInstance.isStalemate()) {
            this.state.winCondition = 'stalemate';
        } else if (this.gameInstance.isDraw()) {
            this.state.winCondition = 'draw';
        } else if (this.gameInstance.isThreefoldRepetition()) {
            this.state.winCondition = 'threefold repetition';
        } else if (this.gameInstance.isInsufficientMaterial()) {
            this.state.winCondition = 'insufficient material';
        }

        this.state.winner = this.state.turn;
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

    resetGame() {}
}

export default ChessGameEngine;
