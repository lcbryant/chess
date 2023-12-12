// ChessController.js
import { Raycaster, Vector2 } from 'three';

export default class ChessController {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.selectedPiece = null;
        this.initMouseHandling();
    }

    initMouseHandling() {
        console.log('Setting up mouse handling');
        window.addEventListener('click', this.onMouseClick.bind(this), false);
    }

    onMouseClick(event) {
        event.preventDefault();
        console.log('Mouse clicked');
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Filter to only consider chess pieces
        const chessPieces = [];
        this.scene.traverse((child) => {
            if (child.isChessPiece) {
                chessPieces.push(child);
            }
        });
        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(chessPieces, true);

        console.log(intersects);
        if (intersects.length > 0) {
            // Implement logic to select and move pieces
            this.selectOrMovePiece(intersects[0]);
        }
    }

    selectOrMovePiece(intersect) {
        let object = intersect.object;
        console.log('Initial clicked object', object);

        // Traverse up to find the actual piece object
        while (object && !object.isChessPiece) {
            object = object.parent;
            console.log('Traversing up, current object:', object);
        }
        // Check if the intersected object is a chess piece
        if (object && object.isChessPiece) {
            console.log('Chess piece found:', object);
            if (this.selectedPiece) {
                this.selectedPiece.setSelected(false); // Deselect previous piece
                console.log('Deselecting piece', this.selectedPiece);
                if (this.selectedPiece === object) {
                    this.selectedPiece = null;
                } else {
                    this.movePiece(intersect);
                    this.selectedPiece = null;
                }
            } else {
                this.selectedPiece = object;
                this.selectedPiece.setSelected(true); // Select new piece
                console.log('Selecting piece', this.selectedPiece);
            }
        }
    }

    movePiece(intersect) {
        // Calculate the new position for the selected piece
        const newPosition = intersect.point;

        // Check if the move is valid
        if (this.isValidMove(this.selectedPiece, newPosition)) {
            // Update the position of the selected piece
            this.selectedPiece.position.copy(newPosition);

            // Deselect the piece
            this.selectedPiece.material.color.set(0xffffff); // Change color to white
            this.selectedPiece = null;
        }
    }

    getBoardPositionFromIntersect(point) {
        // Calculate board position based on the intersection point
        // This is a placeholder, you will need to implement this based on your board setup
        const boardX = Math.floor(point.x / TILE_SIZE);
        const boardZ = Math.floor(point.z / TILE_SIZE);
        return { x: boardX, z: boardZ };
    }

    isValidMove(piece, newPosition) {
        // Check the rules for the specific piece and determine if the move is valid
        // This is a placeholder, you will need to implement the specific rules for each piece
        return true; // For now, all moves are considered valid
    }

    getWorldPositionFromBoardPosition(boardPosition) {
        // Translate board coordinates back to world coordinates
        // This is a placeholder, you will need to implement this based on your board setup
        const worldX = boardPosition.x * TILE_SIZE;
        const worldZ = boardPosition.z * TILE_SIZE;
        return new Vector3(worldX, 0, worldZ); // Assuming the board is at y = 0
    }
}
