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
            if (child.isChessPiece || child.isTile) {
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

    // TODO: Add logic to when you select another piece, remove the one you have captured
    selectOrMovePiece(intersect) {
    let object = intersect.object;

    // Traverse up to find the actual piece or tile object
    while (object && !object.isChessPiece && !object.isTile) {
        object = object.parent;
    }

    // Check if the intersected object is a chess piece
    if (object && object.isChessPiece) {
        if (this.selectedPiece) {
            this.selectedPiece.setSelected(false); // Deselect previous piece
            if (this.selectedPiece === object) {
                this.selectedPiece = null;
            } else { // we clicked on another piece, now find its tile to move to
                const currentTile = object.getCurrentTile(this.scene.getObjectByName('board'));
                this.movePiece(currentTile);
                this.selectedPiece.setSelected(false);
                this.selectedPiece = null;
//                this.selectedPiece = object;
//                this.selectedPiece.setSelected(true); // Select new piece
            }
        } else {
            this.selectedPiece = object;
            this.selectedPiece.setSelected(true); // Select new piece
        }
    } else if (object && object.isTile && this.selectedPiece) {
        // Move the selected piece to the tile
        this.movePiece(object);
        this.selectedPiece.setSelected(false);
        this.selectedPiece = null;
    }
}


   movePiece(tile) {
    // Check if the move is valid
        if (this.isValidMove(this.selectedPiece, tile.userData.chessPosition)) {
            // Update the position of the selected piece to the center of the tile
            const tileCenter = tile.position.clone();
            tileCenter.y = this.selectedPiece.position.y; 
            this.selectedPiece.position.copy(tileCenter);

            // TODO: Need to add logic to remove piece and display it to the side after it has been captured
        }
    }


    getBoardPositionFromIntersect(point) {
        // Calculate board position based on the intersection point
        const boardX = Math.floor(point.x / TILE_SIZE);
        const boardZ = Math.floor(point.z / TILE_SIZE);
        return { x: boardX, z: boardZ };
    }

    isValidMove(piece, newPosition) {
        // Check the rules for the specific piece and determine if the move is valid
        return true; // For now, all moves are considered valid
    }

    getWorldPositionFromBoardPosition(boardPosition) {
        // Translate board coordinates back to world coordinates
        const worldX = boardPosition.x * TILE_SIZE;
        const worldZ = boardPosition.z * TILE_SIZE;
        return new Vector3(worldX, 0, worldZ); // Assuming the board is at y = 0
    }

    getBoardPositionFromWorldPosition(worldPosition) {
        const tileSize = ChessConfig.TILE_SIZE;
        const boardOrigin = ChessConfig.STARTING_VECTOR;
    
        const column = Math.floor((boardOrigin.x - worldPosition.x) / tileSize);
        const row = Math.floor((boardOrigin.z - worldPosition.z) / tileSize);
    
        return { x: row, z: column };
    }
    
    
    
    
}
