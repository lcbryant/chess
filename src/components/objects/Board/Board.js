import {
    Group,
    PlaneGeometry,
    MeshStandardMaterial,
    Color,
    Mesh,
    Vector3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import MODEL from '../../../assets/board_base.glb';

// chess board is going to be 0.5m x 0.5m
const BOARD_SIZE = 0.5;
const DIVISIONS = 8;
const TILE_SIZE = BOARD_SIZE / DIVISIONS;
const TILE_COUNT = DIVISIONS * DIVISIONS;
const WHITE = new Color('white');
const BLACK = new Color('black');

class Board extends Group {
    constructor() {
        super();
        this.name = 'board';
        this.add(this.createBoard());
        this.chessFieldColumns = {
            a: 7,
            b: 6,
            c: 5,
            d: 4,
            e: 3,
            f: 2,
            g: 1,
            h: 0,
        };
        this.chessFieldLetters = {
            7: 'a',
            6: 'b',
            5: 'c',
            4: 'd',
            3: 'e',
            2: 'f',
            1: 'g',
            0: 'h',
        };

        this.createTilePositionMatrix();

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
     * Creates a checkered board with 64 tiles
     * @returns {Mesh} chessBoard
     */
    createBoard() {
        // create the checkered board
        const boardPlane = new PlaneGeometry(
            BOARD_SIZE,
            BOARD_SIZE,
            DIVISIONS,
            DIVISIONS
        );

        boardPlane.name = 'boardPlane';
        // rotate the board so it is flat relative
        boardPlane.rotateX(-Math.PI / 2);
        const checkerMaterials = [
            new MeshStandardMaterial({ color: WHITE }),
            new MeshStandardMaterial({ color: BLACK }),
        ];

        const chessBoard = new Mesh(boardPlane, checkerMaterials);

        let black = false;
        const vertexCount = 6;
        for (const i of [...Array(TILE_COUNT).keys()]) {
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
     */
    createTilePositionMatrix() {
        // starting tile is a8
        const halfTile = TILE_SIZE / 2;
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
            const zOffset = this.chessFieldColumns[key] * TILE_SIZE;
            for (let j = 0; j < DIVISIONS; j++) {
                const centroid = start.clone();
                centroid.x += j * TILE_SIZE;
                centroid.z += zOffset;
                row.push(centroid);
            }
        }
    }
}

export default Board;
