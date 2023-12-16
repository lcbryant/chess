import { Group, Mesh, PlaneGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ChessConfig, ChessPosition } from "../../../config";
import { BoardBase } from "./BoardBase";

/**
 * Represents the 3D chessboard in the game. It is responsible for initializing and managing the tiles
 * of the chessboard, as well as the base on which the board sits.
 */
class Board extends Group {
    /**
     * Constructs a new Board instance.
     *
     * @param {GLTFLoader} loader - The loader used for loading external models such as the board base.
     */
    constructor(loader) {
        super();
        this.name = 'board';
        this.loader = loader;
        this.boardBase = new BoardBase('boardBase');
        this.chessFieldColumns = ChessConfig.chessFieldColumns;
        this.chessFieldLetters = ChessConfig.chessFieldLetters;
        this.markedTiles = [];
        this.initBoard();
        this.initBoardBase();
    }

    /**
     * Initializes the chessboard by creating 64 individual tiles,
     * arranging them in a standard 8x8 grid.
     */
    initBoard() {
        this.tileMatrix = [];
        let black = false;
        let pos = ChessConfig.tileStartingVector;
        const iterations = ChessConfig.divisions;
        for (let row = 0; row < iterations; row++) {
            const rowArray = [];
            for (let col = 0; col < iterations; col++) {
                let material = black
                    ? ChessConfig.darkTileMaterial
                    : ChessConfig.lightTileMaterial;
                const tile = this.createTile(material, pos);
                tile.userData.chessPosition = new ChessPosition(row, col);
                tile.userData.isTile = true;
                tile.name = tile.userData.chessPosition.toAlgebraicNotation();
                rowArray.push(tile.id);
                this.add(tile);
                black = !black;
                pos.x -= ChessConfig.tileSize;
            }
            this.tileMatrix.push(rowArray);
            black = !black;
            pos.x = ChessConfig.tileStartingVector.x;
            pos.z -= ChessConfig.tileSize;
        }
    }

    /**
     * Generates a textual representation of the board for debugging purposes.
     *
     * @returns {string} A string representation of the board layout.
     */
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

    /**
     * Creates a single tile of the chessboard.
     *
     * @param {Material} material - The material to be used for the tile.
     * @param {Vector3} position - The position where the tile will be placed.
     * @returns {Mesh} The created tile as a Mesh object.
     */
    createTile(material, position) {
        const tileGeometry = new PlaneGeometry(
            ChessConfig.tileSize,
            ChessConfig.tileSize
        );
        tileGeometry.receiveShadow = true;
        const mesh = new Mesh(tileGeometry, material);
        mesh.position.copy(position);
        mesh.rotateX(-Math.PI / 2);
        mesh.isTile = true;
        return mesh;
    }

    /**
     * Initializes the base of the chessboard using the provided loader.
     */
    initBoardBase() {
        this.boardBase.initModel(this.loader).then((model) => {
            const base = model.scene;
            this.add(base);
        });
    }

    /**
     * Retrieves a tile based on its chess position.
     *
     * @param {ChessPosition} chessPosition - The chess position of the tile to retrieve.
     * @returns {Mesh} The tile at the given chess position.
     */
    getTileByChessPosition(chessPosition) {
        const { row, column } = chessPosition;
        const tile = this.getObjectById(this.tileMatrix[row][column]);
        return tile;
    }

    /**
     * Retrieves a tile based on its algebraic notation position.
     *
     * @param {string} position - The position in algebraic notation.
     * @returns {Mesh} The tile at the given algebraic notation.
     */
    getTileByAlgebraicNotation(position) {
        const column = this.chessFieldColumns[position[0]];
        const row = parseInt(position[1]) - 1;
        const chessPosition = new ChessPosition(row, column);
        return this.getTileByChessPosition(chessPosition);
    }

    /**
     * Highlights a specified tile to indicate a potential move or selection.
     *
     * @param {Mesh} tile - The tile to be highlighted.
     */
    markTile(tile) {
        const plane = new PlaneGeometry(
            ChessConfig.tileSize,
            ChessConfig.tileSize
        );
        plane.rotateX(-Math.PI / 2);
        const tileMarker = new Mesh(plane, ChessConfig.tileMarkerMaterial);
        tileMarker.position.copy(tile.position);
        tileMarker.userData.chessPosition = tile.userData.chessPosition;
        this.markedTiles.push(tileMarker);
        this.add(tileMarker);
    }

    /**
     * Removes highlight from all marked tiles.
     */
    unmarkTiles() {
        if (!this.markedTiles.length) return;

        this.markedTiles.forEach((marker) => {
            this.remove(marker);
        });

        this.markedTiles = [];
    }

    /**
     * Converts an algebraic notation position to row and column indices.
     *
     * @param {string} position - The position in algebraic notation.
     * @returns {ChessPosition} The corresponding row and column indices.
     */
    algebraicToIndices(position) {
        const column = this.chessFieldColumns[position[0]];
        const row = parseInt(position[1]) - 1;
        return new ChessPosition(row, column);
    }
}

export default Board;
