import Renderer from "../engine/handlers/Renderer";
import Vector2 from "../engine/Tools/Vector2";
import brush from "./Brush";

export default class SquareBrush extends brush {

    constructor(size) {

        super(size);
    }

    /**
     * 
     * @param {Vector2} pos world postion
     * @returns {Vector2[]}
     */
    getAffectedTiles(pos) {

        const positions = [];
        const rad = this.getRad();

        for (let x = 0; x < this._size; x++) {

            for (let y = 0; y < this._size; y++) {

                const tilePos = this.tileToWorldPos(new Vector2(x, y), new Vector2(pos._x - rad, pos._y - rad));

                positions.push(tilePos);
            }
        }

        return positions;
    }

    getLength() {

        return this.getAffectedTiles(new Vector2(0, 0)).length;
    }
}