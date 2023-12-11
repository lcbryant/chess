/**
 * Defines some constants for the chess game
 */
import { Color, MeshPhongMaterial, MeshStandardMaterial } from 'three';

export const PIECE_TYPE = {
    KNIGHT: 'n',
    ROOK: 'r',
    BISHOP: 'b',
    QUEEN: 'q',
    KING: 'k',
    PAWN: 'p',
};
export const PIECE_COLOR = { WHITE: 'w', BLACK: 'b' };

export class ChessPosition {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}

class ChessConfig {
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
        const color = new Color('white');
        return new MeshStandardMaterial({ color });
    }

    static get TILE_BLACK_MATERIAL() {
        const color = new Color('black');
        return new MeshStandardMaterial({ color });
    }

    static get PIECE_COLORS() {
        return ['w', 'b'];
    }

    static get PIECE_WHITE_MATERIAL() {
        const color = new Color(0x808080);
        return new MeshPhongMaterial({ color });
    }

    static get PIECE_BLACK_MATERIAL() {
        const color = new Color(0x0f0f0f);
        return new MeshPhongMaterial({ color });
    }

    static get PIECE_TYPES() {
        return ['p', 'r', 'n', 'b', 'q', 'k'];
    }

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
}

export default ChessConfig;
