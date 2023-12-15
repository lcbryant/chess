import { Piece } from "../components/objects/Pieces";
import { ChessConfig } from "../config";

class GameGUI {
    /**
     * @param {*} state - an object that tracks the state of the game
     */
    constructor(state) {
        this.state = state;
    }

    startGameButton() {
        const button = document.createElement('button');
        button.id = 'startGameButton';
        button.textContent = 'Click to Start Game';
        button.className = 'button center-mid';
        document.body.appendChild(button);
        return button;
    }

    removeStartGameButton() {
        const button = document.getElementById('startGameButton');
        document.body.removeChild(button);
    }

    turnControlButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'turnControlButtons';
        buttonContainer.className = 'top-left';
        buttonContainer.appendChild(this.undoMoveButton());
        buttonContainer.appendChild(this.endTurnButton());
        document.body.appendChild(buttonContainer);
        buttonContainer.style.display = 'none';
        return buttonContainer;
    }

    undoMoveButton() {
        const button = document.createElement('button');
        button.id = 'undoMoveButton';
        button.textContent = 'Undo Move';
        button.className = 'button';
        document.body.appendChild(button);
        return button;
    }

    endTurnButton() {
        const button = document.createElement('button');
        button.id = 'endTurnButton';
        button.textContent = 'End Turn';
        button.className = 'button';
        document.body.appendChild(button);
        return button;
    }

    showTurnControlButtons() {
        const buttonContainer = document.getElementById('turnControlButtons');
        buttonContainer.style.display = 'block';
    }

    hideTurnControlButtons() {
        const buttonContainer = document.getElementById('turnControlButtons');
        buttonContainer.style.display = 'none';
    }

    addCapture(piece) {}

    addWhiteCapture(piece) {}

    addBlackCapture(piece) {}

    clearCaptures() {}
}

export default GameGUI;
