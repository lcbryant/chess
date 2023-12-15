import { Piece } from "../components/objects/Pieces";
import { ChessConfig, GameState } from "../config";

/**
 * GameGUI manages the graphical user interface elements for the chess game.
 * It handles the creation, display, and removal of GUI components like buttons.
 */
class GameGUI {
    /**
     * Creates a GameGUI instance.
     *
     * @param {Object} state The state object of the game, used to track and reflect game status.
     */
    constructor(state) {
        this.state = state;
    }

    /**
     * Creates and displays the 'Start Game' button.
     *
     * @returns {HTMLElement} The created start game button element.
     */
    startGameButton() {
        const button = document.createElement('button');
        button.id = 'startGameButton';
        button.textContent = 'Click to Start Game';
        button.className = 'button center-mid';
        document.body.appendChild(button);
        return button;
    }

    /**
     * Removes the 'Start Game' button from the document.
     */
    removeStartGameButton() {
        const button = document.getElementById('startGameButton');
        document.body.removeChild(button);
    }

    /**
     * Creates a container for turn control buttons, including 'Undo Move' and 'End Turn'.
     *
     * @returns {HTMLElement} The container element holding turn control buttons.
     */
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

    /**
     * Creates and returns the 'End Turn' button.
     *
     * @returns {HTMLElement} The created end turn button element.
     */
    undoMoveButton() {
        const button = document.createElement('button');
        button.id = 'undoMoveButton';
        button.textContent = 'Undo Move';
        button.className = 'button';
        document.body.appendChild(button);
        return button;
    }

    /**
     * Creates and returns the 'End Turn' button.
     *
     * @returns {HTMLElement} The created end turn button element.
     */
    endTurnButton() {
        const button = document.createElement('button');
        button.id = 'endTurnButton';
        button.textContent = 'End Turn';
        button.className = 'button';
        document.body.appendChild(button);
        return button;
    }

    /**
     * Displays the turn control buttons on the GUI.
     */
    showTurnControlButtons() {
        const buttonContainer = document.getElementById('turnControlButtons');
        buttonContainer.style.display = 'block';
    }

    /**
     * Hides the turn control buttons from the GUI.
     */
    hideTurnControlButtons() {
        const buttonContainer = document.getElementById('turnControlButtons');
        buttonContainer.style.display = 'none';
    }

    capturesGui() {
        const capturesContainer = document.createElement('div');
        capturesContainer.id = 'capturesContainer';
        capturesContainer.className = 'top-right';

        const whiteCapturesContainer = document.createElement('div');
        whiteCapturesContainer.id = 'whiteCaptures';
        whiteCapturesContainer.className = 'white-captures-container';

        const blackCapturesContainer = document.createElement('div');
        blackCapturesContainer.id = 'blackCaptures';
        blackCapturesContainer.className = 'black-captures-container';

        capturesContainer.appendChild(whiteCapturesContainer);
        capturesContainer.appendChild(blackCapturesContainer);
        document.body.appendChild(capturesContainer);
        return capturesContainer;
    }

    /**
     * Adds a captured piece to the display. This could be implemented to show captured pieces on the UI.
     *
     * @param {Piece} piece The captured piece to be added to the display.
     */
    addCapture(piece) {
        if (piece.color === 'w') this.addWhiteCapture(piece);
        else this.addBlackCapture(piece);
    }

    addWhiteCapture(piece) {
        const whiteCapturesContainer = document.getElementById(
            'whiteCapturesContainer'
        );
        const pieceContainer = document.createElement('div');
        pieceContainer.id = `w-${piece.type}`;
        pieceContainer.className = 'white-capture';
        pieceContainer.textContent = piece.type;
        whiteCapturesContainer.appendChild(pieceContainer);
    }

    addBlackCapture(piece) {
        const whiteCapturesContainer = document.getElementById(
            'whiteCapturesContainer'
        );
        const pieceContainer = document.createElement('div');
        pieceContainer.id = `w-${piece.type}`;
        pieceContainer.className = 'white-capture';
        pieceContainer.textContent = piece.type;
        whiteCapturesContainer.appendChild(pieceContainer);
    }

    /**
     * Displays a game over message or indicator on the GUI.
     */
    showGameOver() {}

    /**
     * Clears the display of captured pieces, resetting it for a new game.
     */
    clearCaptures() {}
}

export default GameGUI;
