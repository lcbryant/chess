import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Board, Pawn } from 'objects';
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
            const pawn = new Pawn('w', i + 1);
            // tile size is 0.0625m x 0.0625m
            pawn.position.set(0.0625 * i, 0, 0);
            this.add(pawn);
        }
        // add black pawns
        for (let i = 0; i < 8; i++) {
            const pawn = new Pawn('b', i + 1);
            pawn.position.set(0.0625 * i, 0, -0.0625 * 5);
            this.add(pawn);
        }
    }
}

export default ChessScene;
