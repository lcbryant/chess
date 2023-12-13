import { Group, Mesh, PlaneGeometry } from "three";
import { ChessConfig, ChessPosition } from "../../config";
import { BoardBase } from "./BoardBase";

class Board extends Group {
    constructor(loader) {
        super();
        this.name = 'board';
        this.loader = loader;
        this.boardBase = new BoardBase('boardBase');
        this.chessFieldColumns = ChessConfig.CHESS_FIELD_COLUMNS;
        this.chessFieldLetters = ChessConfig.CHESS_FIELD_LETTERS;
        this.initBoard();
        this.initBoardBase();
    }

    /**
     * Creates 64 tiles and adds them to the board and their id to the tileMatrix
     */
    initBoard() {
        this.tileMatrix = [];
        let black = false;
        let pos = ChessConfig.TILE_STARTING_VECTOR;
        for (let i = 0; i < ChessConfig.DIVISIONS; i++) {
            const row = [];
            const rowLetter = this.chessFieldLetters[i];
            for (let j = 0; j < ChessConfig.DIVISIONS; j++) {
                const material = black
                    ? ChessConfig.TILE_BLACK_MATERIAL
                    : ChessConfig.TILE_WHITE_MATERIAL;
                const tile = this.createTile(material, pos);
                tile.userData.chessPosition = new ChessPosition(rowLetter, j);
                tile.name = `${rowLetter}${j + 1}`;
                row.push(tile.id);
                this.add(tile);
                black = !black;
                pos.x -= ChessConfig.TILE_SIZE;
            }
            this.tileMatrix.push(row);
            black = !black;
            pos.x = ChessConfig.TILE_STARTING_VECTOR.x;
            pos.z -= ChessConfig.TILE_SIZE;
        }
    }

    createTile(material, position) {
        const tile = new PlaneGeometry(
            ChessConfig.TILE_SIZE,
            ChessConfig.TILE_SIZE
        );
        tile.receiveShadow = true;
        const mesh = new Mesh(tile, material);
        mesh.position.copy(position);
        mesh.rotateX(-Math.PI / 2);
        mesh.isTile = true;
        return mesh;
    }

    initBoardBase() {
        this.boardBase.initModel(this.loader).then((model) => {
            const base = model.scene;
            this.add(base);
        });
    }
}

export default Board;
