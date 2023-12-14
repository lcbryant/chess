import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ChessConfig, ChessPosition } from '../components/config';

import {
    Bishop,
    Board,
    King,
    Knight,
    Pawn,
    Queen,
    Rook,
} from '../components/objects/Pieces';

class PieceGenerator {
    /**
     * @param {Board} ChessBoard
     * @param {GLTFLoader} loader
     */
    constructor(ChessBoard, loader) {
        this.board = ChessBoard;
        this.tileIds = ChessBoard.tileMatrix;
        this.loader = loader;
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<Pawn>}
     */
    initPawns(color) {
        const pawns = [];
        const pawnType = ChessConfig.PIECE_TYPES.p;
        const row = color === 'w' ? 1 : 6;
        for (let i = 0; i < 8; i++) {
            const algebraicPos = new ChessPosition(row, i);
            const pawn = new Pawn(pawnType, color, algebraicPos, i + 1);
            const pos = this.board.getObjectById(this.tileIds[row][i]).position;
            pawn.position.copy(pos);
            pawn.initWorldPos.copy(pos);
            pawn.initModel(this.loader);
            pawns.push(pawn);
        }
        return pawns;
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<Rook>}
     */
    initRooks(color) {
        const rooks = [];
        const row = this.getMajorPieceInitialRow(color);
        rooks.push(this.createRook(color, { row: row, column: 0 }, 1));
        rooks.push(this.createRook(color, { row: row, column: 7 }, 2));
        return rooks;
    }

    /**
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} chessPos
     * @param {number} number
     */
    createRook(color, chessPos, number) {
        const rook = new Rook(
            ChessConfig.PIECE_TYPES.r,
            color,
            chessPos,
            number
        );
        const pos = this.board.getObjectById(
            this.tileIds[chessPos.row][chessPos.column]
        ).position;
        rook.position.copy(pos);
        rook.initWorldPos.copy(pos);
        rook.initModel(this.loader);
        return rook;
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<Knight>}
     */
    initKnights(color) {
        const knights = [];
        const row = this.getMajorPieceInitialRow(color);
        knights.push(this.createKnight(color, { row: row, column: 1 }, 1));
        knights.push(this.createKnight(color, { row: row, column: 6 }, 2));
        return knights;
    }

    /**
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} chessPos
     * @param {number} number
     */
    createKnight(color, chessPos, number) {
        const knight = new Knight(
            ChessConfig.PIECE_TYPES.n,
            color,
            chessPos,
            number
        );
        const pos = this.board.getObjectById(
            this.tileIds[chessPos.row][chessPos.column]
        ).position;
        knight.position.copy(pos);
        knight.initWorldPos.copy(pos);
        knight.initModel(this.loader);
        return knight;
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<Bishop>}
     */
    initBishops(color) {
        const bishops = [];
        const row = this.getMajorPieceInitialRow(color);
        bishops.push(this.createBishop(color, { row: row, column: 2 }, 1));
        bishops.push(this.createBishop(color, { row: row, column: 5 }, 2));
        return bishops;
    }

    /**
     * @param {PIECE_COLOR} color
     * @param {ChessPosition} chessPos
     * @param {number} number
     */
    createBishop(color, chessPos, number) {
        const bishop = new Bishop(
            ChessConfig.PIECE_TYPES.b,
            color,
            chessPos,
            number
        );
        const pos = this.board.getObjectById(
            this.tileIds[chessPos.row][chessPos.column]
        ).position;
        bishop.position.copy(pos);
        bishop.initWorldPos.copy(pos);
        bishop.initModel(this.loader);
        return bishop;
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<Queen>}
     */
    initQueen(color) {
        const row = this.getMajorPieceInitialRow(color);
        const queen = new Queen(
            ChessConfig.PIECE_TYPES.q,
            color,
            { row: row, column: 4 },
            1
        );
        const pos = this.board.getObjectById(
            this.tileIds[queen.initChessPos.row][queen.initChessPos.column]
        ).position;
        queen.position.copy(pos);
        queen.initWorldPos.copy(pos);
        queen.initModel(this.loader);
        return [queen];
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<King>}
     */
    initKing(color) {
        const row = this.getMajorPieceInitialRow(color);
        const king = new King(
            ChessConfig.PIECE_TYPES.k,
            color,
            { row: row, column: 3 },
            1
        );
        const pos = this.board.getObjectById(
            this.tileIds[king.initChessPos.row][king.initChessPos.column]
        ).position;
        king.position.copy(pos);
        king.initWorldPos.copy(pos);
        king.initModel(this.loader);
        return [king];
    }

    getMajorPieceInitialRow(color) {
        return color === 'w' ? 0 : 7;
    }

    /**
     * creates and stores the pieces in the initial position
     */
    initPieces() {
        this.pieces = {};
        const pieceColors = ChessConfig.PIECE_COLORS;
        for (const color of Object.values(pieceColors)) {
            this.pieces[color] = {
                p: this.initPawns(color),
                r: this.initRooks(color),
                n: this.initKnights(color),
                b: this.initBishops(color),
                q: this.initQueen(color),
                k: this.initKing(color),
            };
        }
    }

    getAllPieces() {
        const pieces = [];
        for (const color of Object.values(ChessConfig.PIECE_COLORS)) {
            const pieceList = this.pieces[color];
            for (const pieceType of Object.values(ChessConfig.PIECE_TYPES)) {
                pieces.push(...pieceList[pieceType]);
            }
        }
        return pieces;
    }

    getPiece(color, type, number) {
        return this.pieces[color][type][number - 1];
    }

    resetPieces() {
        const pieces = this.getAllPieces();
        for (const piece of pieces) {
            if (piece.isChessPiece) {
                piece.reset();
            }
        }
    }
}

export default PieceGenerator;
