import { Color, MeshPhongMaterial, MeshStandardMaterial, Vector3 } from "three";

/**
 * Defines some constants for the chess game
 */

export class ChessPosition {
    /**
     * For simplicity, this class stores the index of the indices of the tile in the Board.tileMatrix
     * @param {number} row
     * @param {number} column
     */
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }

    toAlgebraicNotation() {
        return `${ChessConfig.CHESS_FIELD_LETTERS[this.column]}${this.row + 1}`;
    }
}

export class GameState {
    constructor() {
        this.updateList = [];
        this.gameStarted = false;
        this.turn = 'w';
        this.rotationSpeed = 1;
        this.whiteCaptures = [];
        this.blackCaptures = [];
        this.moveHistory = [];
        this.moveMade = false;
        this.gameOver = false;
        this.winner = null;
    }
}

class ChessConfig {
    static get SCENE_BACKGROUND() {
        return new Color('steelBlue');
    }

    static get TILE_STARTING_VECTOR() {
        const x = ChessConfig.BOARD_SIZE / 2 - ChessConfig.TILE_SIZE / 2;
        const z = ChessConfig.BOARD_SIZE / 2 - ChessConfig.TILE_SIZE / 2;
        return new Vector3(x, 0, z);
    }

    static get CAMERA_POSITION_BLACK() {
        return new Vector3(0, 0.5, -0.4);
    }

    static get CAMERA_POSITION_WHITE() {
        return new Vector3(0, 0.5, 0.4);
    }

    static get BOARD_SIZE() {
        return 0.5;
    }

    static get DIVISIONS() {
        return 8;
    }

    static get TILE_SIZE() {
        return ChessConfig.BOARD_SIZE / ChessConfig.DIVISIONS;
    }

    static get TILE_COUNT() {
        return ChessConfig.DIVISIONS * ChessConfig.DIVISIONS;
    }

    static get TILE_WHITE_MATERIAL() {
        const color = new Color('antiqueWhite').convertSRGBToLinear();
        return new MeshStandardMaterial({ color });
    }

    static get TILE_BLACK_MATERIAL() {
        const color = new Color('black').convertSRGBToLinear();
        return new MeshStandardMaterial({ color });
    }

    static get TILE_HIGHLIGHT_MATERIAL() {
        const color = new Color('red').convertSRGBToLinear();
        const material = new MeshStandardMaterial({ color });
        material.transparent = true;
        material.opacity = 0.5;
        return material;
    }

    static get PIECE_COLORS() {
        return { w: 'w', b: 'b' };
    }

    static get PIECE_WHITE_MATERIAL() {
        const color = new Color(0x808080).convertSRGBToLinear();
        const mat = new MeshPhongMaterial({ color });
        mat.shininess = 100;
        return mat;
    }

    static get PIECE_BLACK_MATERIAL() {
        const color = new Color(0x0f0f0f).convertSRGBToLinear();
        return new MeshPhongMaterial({ color });
    }

    static get PIECE_TYPES() {
        return { p: 'p', r: 'r', n: 'n', b: 'b', q: 'q', k: 'k' };
    }

    /**
     * Maps the column letter to the index of the column in the tileMatrix
     */
    static get CHESS_FIELD_COLUMNS() {
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

    static get CHESS_FIELD_LETTERS() {
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

    static get PIECE_UNICODE() {
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
