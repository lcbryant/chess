import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Board, Pawn, Rook, Knight, Bishop, King, Queen } from '../';
import { ChessPosition, PIECE_TYPE, PIECE_COLOR } from '../../../config';

class PieceGenerator {
    /**
     * @param {Board} ChessBoard
     * @param {GLTFLoader} loader
     */
    constructor(ChessBoard, loader) {
        this.board = ChessBoard;
        this.positions = ChessBoard.tilePositionMatrix;
        this.loader = loader;
    }

    /**
     * @param {PIECE_COLOR} color
     * @returns {Array<Pawn>}
     */
    initPawns(color) {
        const pawns = [];
        const row = color === 'w' ? 'b' : 'g';
        for (let i = 0; i < 8; i++) {
            const algebraicPos = new ChessPosition(row, i);
            const pawn = new Pawn(PIECE_TYPE.PAWN, color, algebraicPos, i + 1);
            pawn.position.copy(this.positions[row][i]);
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
        const rook = new Rook(PIECE_TYPE.ROOK, color, chessPos, number);
        rook.position.copy(this.positions[chessPos.row][chessPos.column]);
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
        const knight = new Knight(PIECE_TYPE.KNIGHT, color, chessPos, number);
        knight.position.copy(this.positions[chessPos.row][chessPos.column]);
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
        const bishop = new Bishop(PIECE_TYPE.BISHOP, color, chessPos, number);
        bishop.position.copy(this.positions[chessPos.row][chessPos.column]);
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
            PIECE_TYPE.QUEEN,
            color,
            { row: row, column: 4 },
            1
        );
        queen.position.copy(this.positions[row][4]);
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
            PIECE_TYPE.KING,
            color,
            { row: row, column: 3 },
            1
        );
        king.position.copy(this.positions[row][3]);
        king.initModel(this.loader);
        return [king];
    }

    getMajorPieceInitialRow(color) {
        return color === 'w' ? 'a' : 'h';
    }

    /**
     * creates and stores the pieces in the initial position
     */
    initPieces() {
        const blackPieces = {
            p: this.initPawns(PIECE_COLOR.BLACK),
            r: this.initRooks(PIECE_COLOR.BLACK),
            n: this.initKnights(PIECE_COLOR.BLACK),
            b: this.initBishops(PIECE_COLOR.BLACK),
            q: this.initQueen(PIECE_COLOR.BLACK),
            k: this.initKing(PIECE_COLOR.BLACK),
        };
        const whitePieces = {
            p: this.initPawns(PIECE_COLOR.WHITE),
            r: this.initRooks(PIECE_COLOR.WHITE),
            n: this.initKnights(PIECE_COLOR.WHITE),
            b: this.initBishops(PIECE_COLOR.WHITE),
            q: this.initQueen(PIECE_COLOR.WHITE),
            k: this.initKing(PIECE_COLOR.WHITE),
        };
        this.pieces = {
            b: blackPieces,
            w: whitePieces,
        };
    }

    getAllPieces() {
        const pieces = [];
        for (const color of Object.values(PIECE_COLOR)) {
            const pieceList = this.pieces[color];
            for (const pieceType of Object.values(PIECE_TYPE)) {
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
            const row = piece.initChessPos.row;
            const column = piece.initChessPos.column;
            piece.reset(this.positions[row][column]);
        }
    }
}

export default PieceGenerator;
