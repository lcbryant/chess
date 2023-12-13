import { Game } from "./Game";

/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

// Initialize core Game class
const game = new Game();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    game.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};

window.requestAnimationFrame(onAnimationFrameHandler);
