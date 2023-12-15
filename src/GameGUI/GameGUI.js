import * as ObservableSlim from "observable-slim";
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
     * @param {GameState} state The state object of the game, used to track and reflect game status.
     */
    constructor(state) {
        this.state = state;
        this.pieceIcons = ChessConfig.PIECE_UNICODE;
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
        whiteCapturesContainer.className = 'captures-container';

        const blackCapturesContainer = document.createElement('div');
        blackCapturesContainer.id = 'blackCaptures';
        blackCapturesContainer.className = 'captures-container';

        capturesContainer.appendChild(whiteCapturesContainer);
        capturesContainer.appendChild(blackCapturesContainer);
        document.body.appendChild(capturesContainer);

        this.addChangeListenerforCaptures();
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

    addChangeListenerforCaptures() {
        ObservableSlim.create(this.state.whiteCaptures, true, (changes) => {
            console.log(changes);
            changes.forEach((change) => {
                if (change.addedCount > 0) {
                    this.addWhiteCapture(change.value);
                } else if (change.removed.length > 0) {
                    this.removeWhiteCapture(change.removed[0]);
                }
            });
        });

        ObservableSlim.create(this.state.blackCaptures, true, (changes) => {
            changes.forEach((change) => {
                if (change.addedCount > 0) {
                    this.addBlackCapture(change.value);
                } else if (change.removed.length > 0) {
                    this.removeBlackCapture(change.removed[0]);
                }
            });
        });
    }

    addWhiteCapture(piece) {
        const whiteCapturesContainer = document.getElementById(
            'whiteCapturesContainer'
        );
        const pieceContainer = document.createElement('h2');
        pieceContainer.id = `b${piece.type}`;
        pieceContainer.className = 'white-capture';
        pieceContainer.textContent = this.pieceIcons.b[piece.type];
        whiteCapturesContainer.appendChild(pieceContainer);
    }

    addBlackCapture(piece) {
        const blackCapturesContainer = document.getElementById(
            'blackCapturesContainer'
        );
        const pieceContainer = document.createElement('h2');
        pieceContainer.id = `b${piece.type}`;
        pieceContainer.className = 'black-capture';
        pieceContainer.textContent = this.pieceIcons.w[piece.type];
        blackCapturesContainer.appendChild(pieceContainer);
    }

    removeCapture(piece) {
        if (piece.color === 'w') this.removeWhiteCapture(piece);
        else this.removeBlackCapture(piece);
    }

    removeWhiteCapture(piece) {
        const whiteCapturesContainer = document.getElementById(
            'whiteCapturesContainer'
        );
        const pieceContainer = document.getElementById(`b${piece.type}`);
        whiteCapturesContainer.removeChild(pieceContainer);
    }

    removeBlackCapture(piece) {
        const blackCapturesContainer = document.getElementById(
            'blackCapturesContainer'
        );
        const pieceContainer = document.getElementById(`b${piece.type}`);
        blackCapturesContainer.removeChild(pieceContainer);
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
