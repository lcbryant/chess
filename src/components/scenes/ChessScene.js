import * as Dat from 'dat.gui';
import { Scene, Color, GridHelper, SpotLightHelper } from 'three';
import { Board, Pawn, Rook, Knight, Bishop, King, Queen } from 'objects';
import { BasicLights } from 'lights';

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
        this.setUpHelpers();
        this.setUpBoard();

        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {}

    setUpHelpers() {
        const gridHelper = new GridHelper(1, 16);
        this.add(gridHelper);
        const spotLight = this.children[0].children[0];
        const spotLightHelper = new SpotLightHelper(spotLight);
        this.add(spotLightHelper);
    }

    setUpBoard() {
        const board = new Board();
        this.add(board);
        const positions = board.tilePositionMatrix;
        // add white pawns
        for (let i = 0; i < 8; i++) {
            const pawn = new Pawn('p', 'w', i + 1);
            pawn.position.copy(positions['b'][i]);
            this.add(pawn);
        }
        // add white rooks
        for (let i = 0; i < 2; i++) {
            const rook = new Rook('r', 'w', i + 1);
            rook.position.copy(positions['a'][i * 7]);
            this.add(rook);
        }
        // add white knights
        for (let i = 0; i < 2; i++) {
            const knight = new Knight('n', 'w', i + 1);
            knight.position.copy(positions['a'][i * 6 > 0 ? 6 : 1]);
            this.add(knight);
        }
        // add white bishops
        for (let i = 0; i < 2; i++) {
            const bishop = new Bishop('b', 'w', i + 1);
            bishop.position.copy(positions['a'][i * 5 > 0 ? 5 : 2]);
            this.add(bishop);
        }
        // add white queen
        const wQueen = new Queen('q', 'w', 1);
        wQueen.position.copy(positions['a'][4]);
        this.add(wQueen);
        // add white king
        const wKing = new King('k', 'w', 1);
        wKing.position.copy(positions['a'][3]);
        this.add(wKing);
        // add black pawns
        for (let i = 0; i < 8; i++) {
            const pawn = new Pawn('p', 'b', i + 1);
            pawn.position.copy(positions['g'][i]);
            this.add(pawn);
        }
        // add black rooks
        for (let i = 0; i < 2; i++) {
            const rook = new Rook('r', 'b', i + 1);
            rook.position.copy(positions['h'][i * 7]);
            this.add(rook);
        }
        // add black knights
        for (let i = 0; i < 2; i++) {
            const knight = new Knight('n', 'b', i + 1);
            knight.position.copy(positions['h'][i * 6 > 0 ? 6 : 1]);
            this.add(knight);
        }
        // add black bishops
        for (let i = 0; i < 2; i++) {
            const bishop = new Bishop('b', 'b', i + 1);
            bishop.position.copy(positions['h'][i * 5 > 0 ? 5 : 2]);
            this.add(bishop);
        }
        // add black queen
        const bQueen = new Queen('q', 'b', 1);
        bQueen.position.copy(positions['h'][4]);
        this.add(bQueen);
        // add black king
        const bKing = new King('k', 'b', 1);
        bKing.position.copy(positions['h'][3]);
        this.add(bKing);
    }
}

export default ChessScene;
