import { Group, PlaneGeometry, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import MODEL from '../../../assets/board_base.glb';

import { ChessConfig } from '../../config';

class Board extends Group {
    constructor() {
        super();
        this.name = 'board';
        this.add(this.createBoard());
        this.chessFieldColumns = ChessConfig.CHESS_FIELD_COLUMNS;
        this.chessFieldLetters = ChessConfig.CHESS_FIELD_LETTERS;

        this.createTilePositionMatrix();

        // loads the model for the base of the chess board
        const loader = new GLTFLoader();
        loader.load(
            MODEL,
            (gltf) => {
                this.add(gltf.scene);
            },
            undefined,
            (error) => console.error(error)
        );
    }

    /**
     * Creates a checkered plane with 64 tiles
     * @returns {Mesh} chessBoard
     */
    createBoard() {
        const boardPlane = new PlaneGeometry(
            ChessConfig.BOARD_SIZE,
            ChessConfig.BOARD_SIZE,
            ChessConfig.DIVISIONS,
            ChessConfig.DIVISIONS
        );

        boardPlane.name = 'boardPlane';
        // rotate the board so it is flat on the xz plane
        boardPlane.rotateX(-Math.PI / 2);
        const checkerMaterials = [
            ChessConfig.TILE_WHITE_MATERIAL,
            ChessConfig.TILE_BLACK_MATERIAL,
        ];

        const chessBoard = new Mesh(boardPlane, checkerMaterials);

        let black = false; // start with white since first tile is a8
        const vertexCount = 6; // 2 triangles * 3 vertices
        for (const i of [...Array(ChessConfig.TILE_COUNT).keys()]) {
            const materialIndex = black ? 1 : 0;
            const start = i * vertexCount;
            chessBoard.geometry.addGroup(start, vertexCount, materialIndex);
            if ((i + 1) % 8 === 0) continue;
            black = !black;
        }

        chessBoard.receiveShadow = true;
        chessBoard.name = 'chessBoard';
        return chessBoard;
    }

    /**
     * Creates a matrix of Vector3 objects that represent the center of each tile
     * The matrix is an object with keys a-h and values consisting of an array of
     * Vector3 objects
     */
    createTilePositionMatrix() {
        // starting tile is a8
        const halfTile = ChessConfig.TILE_SIZE / 2;
        const vertices = this.children[0].geometry.attributes.position.array;
        const start = new Vector3().fromArray(vertices.slice(0, 3));
        start.x += halfTile;
        start.z += halfTile;
        start.y = 0;

        this.tilePositionMatrix = {
            a: [],
            b: [],
            c: [],
            d: [],
            e: [],
            f: [],
            g: [],
            h: [],
        };

        for (const [key, row] of [...Object.entries(this.tilePositionMatrix)]) {
            const zOffset = this.chessFieldColumns[key] * ChessConfig.TILE_SIZE;
            for (let j = 0; j < ChessConfig.DIVISIONS; j++) {
                const centroid = start.clone();
                centroid.x += j * ChessConfig.TILE_SIZE;
                centroid.z += zOffset;
                row.push(centroid);
            }
        }
    }
}

export default Board;
