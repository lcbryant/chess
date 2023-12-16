import { Color, MeshPhongMaterial, MeshStandardMaterial, Vector3 } from "three";

/**
 * Represents a position on the chessboard in terms of its row and column indices.
 */
export class ChessPosition {
    /**
     * For simplicity, this class stores the index of the indices of the tile in the Board.tileMatrix
     *
     * @param {number} row
     * @param {number} column
     */
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    /**
     * Converts the row and column indices to algebraic notation.
     *
     * @returns {string} The position in algebraic notation.
     */
    toAlgebraicNotation() {
        return `${ChessConfig.chessFieldLetters[this.column]}${this.row + 1}`;
    }
}

/**
 * Represents the overall state of the chess game, including the GUI, turn information, and game status.
 */
export class GameState {
    constructor() {
        this.gui = null;
        this.updateList = [];
        this.gameStarted = false;
        this.turn = 'w';
        this.rotationSpeed = 1;
        this.captures = { w: [], b: [] };
        this.promotedPieces = { w: [], b: [] };
        this.moveHistory = [];
        this.moveMade = null;
        this.gameOver = false;
        this.winner = null;
        this.inCheck = null;
        this.winCondition = null;
    }
}

/**
 * Contains static configurations and constants for the chess game.
 */
class ChessConfig {
    constructor() {
        throw new Error('This class cannot be instantsiated.');
    }

    // Constants for scene, tiles, camera positions, materials, etc.
    static get sceneBackground() {
        return new Color('steelBlue');
    }

    /**
     * Returns the position of the first tile created on the board.
     */
    static get tileStartingVector() {
        const x = ChessConfig.boardSize / 2 - ChessConfig.tileSize / 2;
        const z = ChessConfig.boardSize / 2 - ChessConfig.tileSize / 2;
        return new Vector3(x, 0, z);
    }

    /**
     * Returns the position of the camera when it is the black player's turn.
     *
     * @returns {Vector3} - The position of the camera when it is the black player's turn.
     */
    static get blackSideCameraPosition() {
        return new Vector3(0, 0.5, -0.4);
    }

    /**
     * Returns the position of the camera when it is the white player's turn.
     *
     * @returns {Vector3} - The position of the camera when it is the white player's turn.
     */
    static get whiteSideCameraPosition() {
        return new Vector3(0, 0.5, 0.4);
    }

    /**
     * Returns the size of the board.
     *
     * @returns {number} - The size of the board.
     */
    static get boardSize() {
        return 0.5;
    }

    /**
     * Returns the number of tiles on each side of the board.
     *
     * @returns {number} - The number of tiles on each side of the board.
     */
    static get divisions() {
        return 8;
    }

    /**
     * Returns the size of each tile on the board.
     *
     * @returns {number} - The size of each tile on the board.
     */
    static get tileSize() {
        return ChessConfig.boardSize / ChessConfig.divisions;
    }

    /**
     * Returns the total number of tiles on the board.
     *
     * @returns {number} - The total number of tiles on the board.
     */
    static get tileCount() {
        return ChessConfig.divisions * ChessConfig.divisions;
    }

    /**
     * Returns the material for the light tiles. The color is not
     * pure white to allow for lighting effects.
     *
     * @returns {MeshStandardMaterial} - The material for the light tiles.
     */
    static get lightTileMaterial() {
        const color = new Color('antiqueWhite').convertSRGBToLinear();
        return new MeshStandardMaterial({ color });
    }

    /**
     * Returns the material for the dark tiles.
     *
     * @returns {MeshStandardMaterial} - The material for the dark tiles.
     */
    static get darkTileMaterial() {
        const color = new Color('black').convertSRGBToLinear();
        return new MeshStandardMaterial({ color });
    }

    /**
     * Returns the material for the tile marker.
     *
     * @returns {MeshStandardMaterial} - The material for the tile marker.
     */
    static get tileMarkerMaterial() {
        const color = new Color('red').convertSRGBToLinear();
        const material = new MeshStandardMaterial({ color });
        material.transparent = true;
        material.opacity = 0.5;
        return material;
    }

    /**
     * Maps the chess piece types to their corresponding indices in the tileMatrix.
     *
     * @returns {object} - An object mapping the piece types to their corresponding indices.
     */
    static get pieceColorStrings() {
        return { w: 'w', b: 'b' };
    }

    /**
     * Returns the material for the chess piece based on its color. Color is chosen
     * due to how the chess pieces interact with lighting.
     *
     * @returns {MeshPhongMaterial} - The material for the chess piece.
     */
    static get lightPieceMaterial() {
        const color = new Color(0x808080).convertSRGBToLinear();
        const mat = new MeshPhongMaterial({ color });
        mat.shininess = 100;
        return mat;
    }

    /**
     * Returns the material for the chess piece based on its color. Color is chosen
     * due to how the chess pieces interact with lighting.
     *
     * @returns {MeshPhongMaterial} - The material for the chess piece.
     */
    static get darkPieceMaterial() {
        const color = new Color(0.15, 0.15, 0.15).convertSRGBToLinear();
        return new MeshPhongMaterial({ color });
    }

    /**
     * Maps the chess piece types to their corresponding characters in FEN notation.
     * The characters are used to represent the pieces in the FEN string.
     *
     * @returns {object} - An object mapping the piece types to their corresponding characters.
     */
    static get pieceTypeCharacters() {
        return { p: 'p', r: 'r', n: 'n', b: 'b', q: 'q', k: 'k' };
    }

    /**
     * Maps column letters to their corresponding indices in the tileMatrix.
     *
     * @returns {object} - An object mapping the column letters to their corresponding indices.
     */
    static get chessFieldColumns() {
        return {
            a: 7,
            b: 6,
            c: 5,
            d: 4,
            e: 3,
            f: 2,
            g: 1,
            h: 0,
        };
    }

    /**
     * Maps column indices to their corresponding letters in algebraic notation.
     *
     * @returns {object} - An object mapping the column indices to their corresponding letters.
     */
    static get chessFieldLetters() {
        return {
            7: 'a',
            6: 'b',
            5: 'c',
            4: 'd',
            3: 'e',
            2: 'f',
            1: 'g',
            0: 'h',
        };
    }

    /**
     * Unicode characters for chess pieces, categorized by color.
     */
    static get pieceUnicode() {
        return {
            w: {
                p: '\u2659',
                r: '\u2656',
                n: '\u2658',
                b: '\u2657',
                q: '\u2655',
                k: '\u2654',
            },
            b: {
                p: '\u265F',
                r: '\u265C',
                n: '\u265E',
                b: '\u265D',
                q: '\u265B',
                k: '\u265A',
            },
        };
    }
}

export default ChessConfig;
