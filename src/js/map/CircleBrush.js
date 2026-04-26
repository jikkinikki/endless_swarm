import Debug from "../engine/debug/Debug";
import MouseInput from "../engine/inputs/MouseInput";
import Renderer from "../engine/handlers/Renderer";
import Vector2 from "../engine/Tools/Vector2";
import brush from "./Brush";

export default class CircleBrush extends brush {

    constructor(size) {

        super(size);
    }

    /**
     * 
     * @param {Vector2} pos 
     * @returns {Vector2[]}
     */
    getAffectedTiles(pos) {

        const positions = [];
        const tileSize = 16;

        const center = this.tileToWorldPos(pos, new Vector2(0, 0));
        const rad = this.getRad();

        for (let x = 0; x < this._size; x++) {
            for (let y = 0; y < this._size; y++) {

                const tilePos = this.tileToWorldPos(new Vector2(x, y), new Vector2(pos._x - rad, pos._y - rad));
                const dist = Math.sqrt(Math.pow(tilePos._x - center._x, 2) + Math.pow(tilePos._y - center._y, 2));

                if (x == 1 && y == 1) {

                    // Debug.intervalLimPrint("tb: " + tilePos.toString(), 20);
                    // console.log(x, y, pos.toString());
                    // console.log(MouseInput.mousePos.toString());
                }

                // console.log(tilePos.x, tilePos.y);
                // console.log(dist, this._size * tileSize * Renderer.getZoom() / 2);

                if (dist < this._size * tileSize * Renderer.getZoom() / 2 / 2) {    
                    positions.push(tilePos);
                }
            }
        }

        return positions;
    }

    getLength() {

        return this.getAffectedTiles(new Vector2(0, 0)).length;
    }
}