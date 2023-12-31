import { Piece } from "../components/objects/Pieces";
import { ChessConfig, GameState } from "../config";

/**
 * GameGUI manages the graphical user interface elements for the chess game.
 * It handles the creation, display, and removal of GUI components like buttons.
 */
class GameGUI {
    /**
     * Creates a GameGUI instance.
     */
    constructor() {
        this.pieceIcons = ChessConfig.pieceUnicode;
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
    }

    /**
     * Adds a captured piece to the display. This could be implemented to show captured pieces on the UI.
     *
     * @param {Piece} piece The captured piece to be added to the display.
     */
    addCapture(piece) {
        // send it to opposite color b/c the capturer is the opposite color
        if (piece.color === 'w') this.addBlackCapture(piece);
        else this.addWhiteCapture(piece);
    }

    addWhiteCapture(piece) {
        const whiteCaptures = document.getElementById('whiteCaptures');
        const pieceContainer = document.createElement('h2');
        pieceContainer.id = `b${piece.type}`;
        pieceContainer.className = 'white-capture';
        pieceContainer.textContent = this.pieceIcons.b[piece.type];
        whiteCaptures.appendChild(pieceContainer);
    }

    addBlackCapture(piece) {
        const blackCaptures = document.getElementById('blackCaptures');
        const pieceContainer = document.createElement('h2');
        pieceContainer.id = `w${piece.type}`;
        pieceContainer.className = 'black-capture';
        pieceContainer.textContent = this.pieceIcons.w[piece.type];
        blackCaptures.appendChild(pieceContainer);
    }

    removeCapture(piece) {
        if (piece.color === 'w') this.removeBlackCapture(piece);
        else this.removeWhiteCapture(piece);
    }

    removeWhiteCapture(piece) {
        const whiteCaptures = document.getElementById('whiteCaptures');
        const pieceContainer = document.getElementById(`b${piece.type}`);
        whiteCaptures.removeChild(pieceContainer);
    }

    removeBlackCapture(piece) {
        const blackCaptures = document.getElementById('blackCaptures');
        const pieceContainer = document.getElementById(`w${piece.type}`);
        blackCaptures.removeChild(pieceContainer);
    }

    promotionGui() {
        const promotionContainer = document.createElement('div');
        promotionContainer.id = 'promotionContainer';
        promotionContainer.className = 'center-mid';

        const queenButton = document.createElement('button');
        queenButton.id = 'queenButton';
        queenButton.className = 'button';
        queenButton.textContent = this.pieceIcons.w.q;

        const rookButton = document.createElement('button');
        rookButton.id = 'rookButton';
        rookButton.className = 'button';
        rookButton.textContent = this.pieceIcons.w.r;

        const bishopButton = document.createElement('button');
        bishopButton.id = 'bishopButton';
        bishopButton.className = 'button';
        bishopButton.textContent = this.pieceIcons.w.b;

        const knightButton = document.createElement('button');
        knightButton.id = 'knightButton';
        knightButton.className = 'button';
        knightButton.textContent = this.pieceIcons.w.n;

        promotionContainer.appendChild(queenButton);
        promotionContainer.appendChild(rookButton);
        promotionContainer.appendChild(bishopButton);
        promotionContainer.appendChild(knightButton);

        document.body.appendChild(promotionContainer);

        promotionContainer.style.display = 'none';

        return { queenButton, rookButton, bishopButton, knightButton };
    }

    hidePromotionGui() {
        const promotionContainer =
            document.getElementById('promotionContainer');
        promotionContainer.style.display = 'none';
    }

    showPromotionGui() {
        const promotionContainer =
            document.getElementById('promotionContainer');
        promotionContainer.style.display = 'block';
    }

    /**
     * Displays a game over message or indicator on the GUI.
     */
    showGameOver() {
        const gameOverContainer = document.createElement('div');
        gameOverContainer.id = 'gameOverContainer';
        gameOverContainer.className = 'center-mid';
        gameOverContainer.textContent = 'Game Over';

        const restartButton = document.createElement('button');
        restartButton.id = 'restartButton';
        restartButton.className = 'button';
        restartButton.textContent = 'Restart Game';

        document.body.appendChild(gameOverContainer);

        return restartButton;
    }

    /**
     * Clears the display of captured pieces, resetting it for a new game.
     */
    clearCaptures() {
        const whiteCaptures = document.getElementById('whiteCaptures');
        const blackCaptures = document.getElementById('blackCaptures');
        whiteCaptures.innerHTML = '';
        blackCaptures.innerHTML = '';
    }
}

export default GameGUI;
