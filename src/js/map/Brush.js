import Renderer from "../engine/handlers/Renderer";
import Vector2 from "../engine/Tools/Vector2";

export default class brush {

    constructor(size) {

        this._size = size;
    }

    /**
     * @param {Vector2} center position of middle
     * 
     * @returns {Vector2[]} array of positions to apply brush to.
     */
    getAffectedTiles(center) {


    }

    tileToWorldPos(pos, offset) {

        const tileSize = 16;

        const x = pos.x * tileSize * Renderer.getZoom() / 2;
        const y = pos.y * tileSize * Renderer.getZoom() / 2;

        const offx = offset.x * tileSize * Renderer.getZoom() / 2;
        const offy = offset.y * tileSize * Renderer.getZoom() / 2;

        return new Vector2(x, y).add(new Vector2(offx, offy));
    }

    getRad(){

        return Math.floor(this._size / 2);
    }
}