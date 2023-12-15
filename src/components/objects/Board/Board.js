import { Group, Mesh, PlaneGeometry } from "three";
import { ChessConfig, ChessPosition } from "../../../config";
import { BoardBase } from "./BoardBase";

class Board extends Group {
    constructor(loader) {
        super();
        this.name = 'board';
        this.loader = loader;
        this.boardBase = new BoardBase('boardBase');
        this.chessFieldColumns = ChessConfig.CHESS_FIELD_COLUMNS;
        this.chessFieldLetters = ChessConfig.CHESS_FIELD_LETTERS;
        this.markedTiles = [];
        this.initBoard();
        this.initBoardBase();
    }

    /**
     * Creates 64 tiles and adds them to the board and their id to the tileMatrix
     * Tiles are added right to left, top to bottom from the camera's perspective
     */
    initBoard() {
        this.tileMatrix = [];
        let black = false;
        let pos = ChessConfig.TILE_STARTING_VECTOR;
        const iterations = ChessConfig.DIVISIONS;
        for (let row = 0; row < iterations; row++) {
            const rowArray = [];
            for (let col = 0; col < iterations; col++) {
                let material = black
                    ? ChessConfig.TILE_BLACK_MATERIAL
                    : ChessConfig.TILE_WHITE_MATERIAL;
                const tile = this.createTile(material, pos);
                tile.userData.chessPosition = new ChessPosition(row, col);
                tile.userData.isTile = true;
                tile.name = tile.userData.chessPosition.toAlgebraicNotation();
                rowArray.push(tile.id);
                this.add(tile);
                black = !black;
                pos.x -= ChessConfig.TILE_SIZE;
            }
            this.tileMatrix.push(rowArray);
            black = !black;
            pos.x = ChessConfig.TILE_STARTING_VECTOR.x;
            pos.z -= ChessConfig.TILE_SIZE;
        }
    }

    generateTextBoard() {
        let textBoard = '| ';
        for (let i = 0; i < this.tileMatrix.length; i++) {
            for (let j = 0; j < this.tileMatrix[i].length; j++) {
                const tile = this.getObjectById(this.tileMatrix[i][j]);
                textBoard += tile.name + ' | ';
            }
            if (i < this.tileMatrix.length - 1)
                textBoard += '\n-----------------------------------------\n| ';
        }
        return textBoard;
    }

    createTile(material, position) {
        const tileGeometry = new PlaneGeometry(
            ChessConfig.TILE_SIZE,
            ChessConfig.TILE_SIZE
        );
        tileGeometry.receiveShadow = true;
        const mesh = new Mesh(tileGeometry, material);
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

    /**
     * @param {ChessPosition} chessPos
     * @returns {Mesh}
     */
    getTileByChessPosition(chessPos) {
        const { row, column } = chessPos;
        const tile = this.getObjectById(this.tileMatrix[row][column]);
        return tile;
    }

    getTileByAlgebraicNotation(pos) {
        const column = this.chessFieldColumns[pos[0]];
        const row = parseInt(pos[1]) - 1;
        const chessPos = new ChessPosition(row, column);
        return this.getTileByChessPosition(chessPos);
    }

    markTile(tile) {
        const plane = new PlaneGeometry(
            ChessConfig.TILE_SIZE,
            ChessConfig.TILE_SIZE
        );
        plane.rotateX(-Math.PI / 2);
        const tileMarker = new Mesh(plane, ChessConfig.TILE_HIGHLIGHT_MATERIAL);
        tileMarker.position.copy(tile.position);
        tileMarker.userData.chessPosition = tile.userData.chessPosition;
        this.markedTiles.push(tileMarker);
        this.add(tileMarker);
    }

    unmarkTiles() {
        if (!this.markedTiles.length) return;

        this.markedTiles.forEach((marker) => {
            this.remove(marker);
        });

        this.markedTiles = [];
    }

    algebraicToIndices(position) {
        const column = this.chessFieldColumns[position[0]];
        const row = parseInt(position[1]) - 1;
        return new ChessPosition(row, column);
    }
}

export default Board;
