import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ChessConfig, ChessPosition } from "../config";

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
        for (let col = 0; col < 8; col++) {
            const tile = this.board.getObjectById(this.tileIds[row][col]);
            const pawn = new Pawn(
                pawnType,
                color,
                tile.userData.chessPosition,
                tile.position,
                col + 1
            );
            pawn.position.copy(tile.position);
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
        const tile = this.board.getObjectById(
            this.tileIds[chessPos.row][chessPos.column]
        );
        const rook = new Rook(
            ChessConfig.PIECE_TYPES.r,
            color,
            tile.userData.chessPosition,
            tile.position,
            number
        );

        rook.position.copy(tile.position);
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
        const tile = this.board.getObjectById(
            this.tileIds[chessPos.row][chessPos.column]
        );
        const knight = new Knight(
            ChessConfig.PIECE_TYPES.n,
            color,
            tile.userData.chessPosition,
            tile.position,
            number
        );
        knight.position.copy(tile.position);
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
        const tile = this.board.getObjectById(
            this.tileIds[chessPos.row][chessPos.column]
        );
        const bishop = new Bishop(
            ChessConfig.PIECE_TYPES.b,
            color,
            tile.userData.chessPosition,
            tile.position,
            number
        );
        bishop.position.copy(tile.position);
        bishop.initModel(this.loader);
        return bishop;
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<Queen>}
     */
    initQueen(color) {
        const row = this.getMajorPieceInitialRow(color);
        const tile = this.board.getObjectById(this.tileIds[row][4]);
        const queen = new Queen(
            ChessConfig.PIECE_TYPES.q,
            color,
            tile.userData.chessPosition,
            tile.position,
            1
        );
        queen.position.copy(tile.position);
        queen.initModel(this.loader);
        return [queen];
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<King>}
     */
    initKing(color) {
        const row = this.getMajorPieceInitialRow(color);
        const tile = this.board.getObjectById(this.tileIds[row][3]);
        const king = new King(
            ChessConfig.PIECE_TYPES.k,
            color,
            tile.userData.chessPosition,
            tile.position,
            1
        );
        king.position.copy(tile.position);
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

    createPiece(type, color, chessPos, worldPos, number) {
        let piece;
        switch (type) {
            case ChessConfig.PIECE_TYPES.p:
                piece = new Pawn(type, color, chessPos, worldPos, number);
            case ChessConfig.PIECE_TYPES.r:
                piece = new Rook(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.PIECE_TYPES.n:
                piece = new Knight(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.PIECE_TYPES.b:
                piece = new Bishop(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.PIECE_TYPES.q:
                piece = new Queen(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.PIECE_TYPES.k:
                piece = new King(type, color, chessPos, worldPos, number);
                break;
            default:
                console.error(`Invalid piece type: ${type}`);
        }

        piece.initModel(this.loader);
        return piece;
    }
}

export default PieceGenerator;
