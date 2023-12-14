import { Color, MeshPhongMaterial, MeshStandardMaterial, Vector3 } from 'three';

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

class ChessConfig {
    static get SCENE_BACKGROUND() {
        return new Color('steelBlue');
    }

    static get TILE_STARTING_VECTOR() {
        const x = -ChessConfig.BOARD_SIZE / 2 + ChessConfig.TILE_SIZE / 2;
        const z = -ChessConfig.BOARD_SIZE / 2 + ChessConfig.TILE_SIZE / 2;
        return new Vector3(x, 0, z);
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
            a: 0,
            b: 1,
            c: 2,
            d: 3,
            e: 4,
            f: 5,
            g: 6,
            h: 7,
        };
    }

    static get CHESS_FIELD_LETTERS() {
        return {
            0: 'a',
            1: 'b',
            2: 'c',
            3: 'd',
            4: 'e',
            5: 'f',
            6: 'g',
            7: 'h',
        };
    }
}

export default ChessConfig;
