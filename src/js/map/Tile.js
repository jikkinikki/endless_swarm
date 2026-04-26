import Animation from "../engine/Animation/Animation";
import Obj from "../engine/Tools/Obj";
import Vector2 from "../engine/Tools/Vector2";
import TileHandler from "./TileHandler";

export default class Tile extends Obj {

    constructor(position, url, x, y) {

        // const tilePos = new Vector2(x * tile.anim.width * tile.anim.scale, y * tile.anim.height * tile.anim.scale);
        super(position);

        this.anim = new Animation(url, 1, 0, 1).setSize(16, 16).setStartOffset(new Vector2(x * 16, y * 16));
        this.walkable = true;

        // this.setId("none");
    }

    setId(id) {

        if (!TileHandler) {
            console.log("TileHandler not loaded yet! Proably that circle loading bug again...");
        }

        if (this._id)
            TileHandler.removeTileId(this._id)

        TileHandler.addTileId(id, this);
        this._id = id;

        return this;
    }

    setWalkable(walkable) {

        this.walkable = walkable;
        return this;
    }

    setAnim(url, x, y) {

        this.anim = new Animation(url, 1, 0, 1).setSize(16, 16).setStartOffset(new Vector2(x * 16, y * 16));
    }

    /**
     * 
     * @returns {Animation} an animation object. NOT CLONED!
     */
    getAnim() {

        return this.anim;
    }

    setOffset(offset) {

        this.anim.setStartOffset(offset.scale(16));
    }

    /**
     * 
     * @returns {Vector2} The offset in the loeaded spritesheet
     */
    getOffset() {

        return this.anim.startOffset.clone().scale(1 / 16);
    }

    render(ctx) {

        super.render(ctx);
    }

    /**
     * 
     * @param {Vector2} pos 
     * @returns {Tile}
     */
    clone() {

        /**
         * @type {Tile}
         */
        const newTile = super.clone();

        newTile.setPosition(this.position.clone());

        newTile.setAnim(this.anim.path, this.anim.startOffset.x, this.anim.startOffset.y);
        newTile.setOffset(this.getOffset());

        return newTile;
    }
}