import { Group, PlaneGeometry, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import MODEL from '../../../assets/board_base.glb';
import { ChessConfig, ChessPosition } from '../../config';

class Board extends Group {
    constructor(loader) {
        super();
        this.name = 'board';
        const baseModel = this.initBaseModel(loader);
        this.add(baseModel);
        this.chessFieldColumns = ChessConfig.CHESS_FIELD_COLUMNS;
        this.chessFieldLetters = ChessConfig.CHESS_FIELD_LETTERS;
        this.createBoard();
    }

    /**
     * Creates 64 tiles and adds them to the board and their id to the tileMatrix
     * @returns {Mesh} chessBoard
     */
    createBoard() {
        this.tileMatrix = [];
        let black = false;
        let pos = ChessConfig.STARTING_VECTOR;
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
            pos.x = ChessConfig.STARTING_VECTOR.x;
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
        return mesh;
    }

    /**
     *  @param {GLTFLoader} loader
     *  @returns {Promise<GLTF>}
     */
    initBaseModel(loader) {
        return new Promise((resolve, reject) => {
            loader.load(
                MODEL,
                (gltf) => {
                    this.add(gltf.scene);
                    resolve(gltf);
                },
                undefined,
                (event) => {
                    reject(event);
                }
            );
        });
    }
}

export default Board;
