import { Group, Mesh, PlaneGeometry } from 'three';
import { ChessConfig, ChessPosition } from '../../../config';
import { BoardBase } from './BoardBase';

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
        for (let row = ChessConfig.DIVISIONS - 1; row >= 0; row--) {
            const rowArray = [];
            for (let col = 0; col < ChessConfig.DIVISIONS; col++) {
                let material = black
                    ? ChessConfig.TILE_BLACK_MATERIAL
                    : ChessConfig.TILE_WHITE_MATERIAL;
                const tile = this.createTile(material, pos);
                tile.userData.chessPosition = new ChessPosition(row, col);
                tile.name = tile.userData.chessPosition.toAlgebraicNotation();
                rowArray.push(tile.id);
                this.add(tile);
                black = !black;
                pos.x += ChessConfig.TILE_SIZE;
            }
            this.tileMatrix.push(rowArray);
            black = !black;
            pos.x = ChessConfig.TILE_STARTING_VECTOR.x;
            pos.z += ChessConfig.TILE_SIZE;
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
        const tileId = this.tileMatrix[row][column];
        return this.getObjectById(tileId);
    }

    markTileForMove(chessPos) {
        const tile = this.getTileByChessPosition(chessPos);
        tile.material.emissive.setColorName('yellow');
        tile.material.emissiveIntensity = 0.75;
    }
}

export default Board;
