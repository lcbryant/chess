import { BaseObject } from 'objects/BaseObject/BaseObject';
import { Color, Mesh, MeshPhongMaterial, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const PIECE_COLORS = 'white' | 'black';
const PIECE_TYPES = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

class Piece extends BaseObject {
    /**
     *
     * @param {PIECE_TYPES} type
     * @param {*} model
     * @param {PIECE_COLORS} color
     * @param {*} initialPosition
     */
    constructor(type, model, color, initialPosition) {}
}

export default Piece;
