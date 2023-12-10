import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Board, Pawn, Rook, Knight, Bishop, King, Queen } from 'objects';
import { BasicLights } from 'lights';

const TILE_SIZE = 0.0625; // board tile size, 0.0625m / 6.25cm / 2.5in

class ChessScene extends Scene {
    constructor() {
        super();

        this.state = {
            gui: new Dat.GUI(),
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x000000);

        const lights = new BasicLights();
        this.add(lights);
        this.setUpBoard();

        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {}

    setUpBoard() {
        const board = new Board();
        this.add(board);
        // add white pawns
        for (let i = 0; i < 8; i++) {
            const pawn = new Pawn('p', 'w', i + 1);
            pawn.position.set(TILE_SIZE * i, 0, 0);
            this.add(pawn);
        }
        // add white rooks
        for (let i = 0; i < 2; i++) {
            const rook = new Rook('r', 'w', i + 1);
            rook.position.set(TILE_SIZE * 7 * i, 0, 0);
            this.add(rook);
        }
        // add white knights
        for (let i = 0; i < 2; i++) {
            const knight = new Knight('n', 'w', i + 1);
            knight.position.set(TILE_SIZE * 5 * i, 0, 0);
            this.add(knight);
        }
        // add white bishops
        for (let i = 0; i < 2; i++) {
            const bishop = new Bishop('b', 'w', i + 1);
            bishop.position.set(TILE_SIZE * 3 * i, 0, 0);
            this.add(bishop);
        }
        // add white queen
        const queen = new Queen('q', 'w', 1);
        this.add(queen);
        // add white king
        const king = new King('k', 'w', 1);
        this.add(king);
        // add black pawns
        for (let i = 0; i < 8; i++) {
            const pawn = new Pawn('p', 'b', i + 1);
            pawn.position.set(TILE_SIZE * i, 0, -TILE_SIZE * 5);
            this.add(pawn);
        }
        // add black rooks
        for (let i = 0; i < 2; i++) {
            const rook = new Rook('r', 'b', i + 1);
            rook.position.set(TILE_SIZE * 7 * i, 0, -TILE_SIZE * 7);
            this.add(rook);
        }
        // add black knights
        for (let i = 0; i < 2; i++) {
            const knight = new Knight('n', 'b', i + 1);
            knight.position.set(TILE_SIZE * 5 * i, 0, -TILE_SIZE * 7);
            this.add(knight);
        }
        // add black bishops
        for (let i = 0; i < 2; i++) {
            const bishop = new Bishop('b', 'b', i + 1);
            bishop.position.set(TILE_SIZE * 3 * i, 0, -TILE_SIZE * 7);
            this.add(bishop);
        }
        // add black queen
        const queen2 = new Queen('q', 'b', 1);
        queen2.position.set(0, 0, -TILE_SIZE * 7);
        this.add(queen2);
        // add black king
        const king2 = new King('k', 'b', 1);
        king2.position.set(0, 0, -TILE_SIZE * 7);
        this.add(king2);
    }
}

export default ChessScene;
