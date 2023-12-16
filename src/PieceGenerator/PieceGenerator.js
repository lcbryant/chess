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

/**
 * The PieceGenerator class handles the creation and initialization of all chess pieces
 * on the board. It uses the provided Board instance and GLTFLoader to place pieces at
 * their initial positions and load their respective 3D models.
 */
class PieceGenerator {
    /**
     * Constructs the PieceGenerator instance.
     *
     * @param {Board} ChessBoard - The Board instance where the pieces will be placed.
     * @param {GLTFLoader} loader - The loader used for loading 3D models of the pieces.
     */
    constructor(ChessBoard, loader) {
        this.board = ChessBoard;
        this.tileIds = ChessBoard.tileMatrix;
        this.loader = loader;
    }

    /**
     * Initializes and returns an array of Pawn pieces for the specified color.
     *
     * @param {PIECE_COLOR} color - The color of the pawns ('w' for white, 'b' for black).
     * @returns {Array<Pawn>} An array of initialized Pawn pieces.
     */
    initPawns(color) {
        const pawns = [];
        const pawnType = ChessConfig.pieceTypeCharacters.p;
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
     * Initializes and returns an array of Rook pieces for the specified color.
     *
     * @param {PIECE_COLOR} color - The color of the rooks.
     * @returns {Array<Rook>} An array of initialized Rook pieces.
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
            ChessConfig.pieceTypeCharacters.r,
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
     * Initializes and returns an array of Knight pieces for the specified color.
     *
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
            ChessConfig.pieceTypeCharacters.n,
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
     * Initializes and returns an array of Bishop pieces for the specified color.
     *
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
            ChessConfig.pieceTypeCharacters.b,
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
     * Initializes and returns an array with a Queen piece for the specified color.
     *
     * @param {PIECE_COLOR} color
     * @returns {Array<Queen>}
     */
    initQueen(color) {
        const row = this.getMajorPieceInitialRow(color);
        const tile = this.board.getObjectById(this.tileIds[row][4]);
        const queen = new Queen(
            ChessConfig.pieceTypeCharacters.q,
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
     * Initializes and returns an array with a King piece for the specified color.
     *
     * @param {PIECE_COLOR} color
     * @returns {Array<King>}
     */
    initKing(color) {
        const row = this.getMajorPieceInitialRow(color);
        const tile = this.board.getObjectById(this.tileIds[row][3]);
        const king = new King(
            ChessConfig.pieceTypeCharacters.k,
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
     * Creates all pieces and stores them in their initial positions.
     * This method is called to set up the board with all the chess pieces.
     */
    initPieces() {
        this.pieces = {};
        const pieceColors = ChessConfig.pieceColorStrings;
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

    /**
     * Retrieves all pieces from the board.
     *
     * @returns {Array<Object3D>} An array containing all the pieces on the board.
     */
    getAllPieces() {
        const pieces = [];
        for (const color of Object.values(ChessConfig.pieceColorStrings)) {
            const pieceList = this.pieces[color];
            for (const pieceType of Object.values(
                ChessConfig.pieceTypeCharacters
            )) {
                pieces.push(...pieceList[pieceType]);
            }
        }
        return pieces;
    }

    /**
     * Retrieves a specific piece based on its color, type, and number.
     *
     * @param {PIECE_COLOR} color - The color of the piece.
     * @param {string} type - The type of the piece (e.g., 'p' for Pawn).
     * @param {number} number - The identifier number for the piece.
     * @returns {Object3D} The specified chess piece.
     */
    getPiece(color, type, number) {
        return this.pieces[color][type][number - 1];
    }

    /**
     * Resets all pieces to their initial positions and states.
     * This is typically used when resetting the game.
     */
    resetPieces() {
        const pieces = this.getAllPieces();
        for (const piece of pieces) {
            if (piece.isChessPiece) {
                piece.reset();
            }
        }
    }

    /**
     * Creates a chess piece of the specified type and color, placing it at the given position.
     *
     * @param {string} type - The type of the piece (e.g., 'k' for King).
     * @param {PIECE_COLOR} color - The color of the piece.
     * @param {ChessPosition} chessPos - The chess position of the piece.
     * @param {Vector3} worldPos - The world position of the piece.
     * @param {number} number - The identifier number for the piece.
     * @returns {Object3D} The created chess piece.
     */
    createPiece(type, color, chessPos, worldPos, number) {
        let piece;
        switch (type) {
            case ChessConfig.pieceTypeCharacters.p:
                piece = new Pawn(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.pieceTypeCharacters.r:
                piece = new Rook(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.pieceTypeCharacters.n:
                piece = new Knight(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.pieceTypeCharacters.b:
                piece = new Bishop(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.pieceTypeCharacters.q:
                piece = new Queen(type, color, chessPos, worldPos, number);
                break;
            case ChessConfig.pieceTypeCharacters.k:
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
