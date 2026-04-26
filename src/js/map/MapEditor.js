import Animation from "../engine/Animation/Animation";
import Handler from "../engine/handlers/Handler";
import KeyboardInput from "../engine/inputs/KeyboardInput";
import TileHandler from "./TileHandler";
import MapHandler from "./MapHandler";
import Tile from "./Tile";
import MouseInput from "../engine/inputs/MouseInput";
import Renderer from "../engine/handlers/Renderer";
import Vector2 from "../engine/Tools/Vector2";
import SquareBrush from "./SquareBrush";
import CircleBrush from "./CircleBrush";
import RandomBrush from "./RandomBrush";
import HandlerBase from "../engine/handlers/HandlerBase";
import Debug from "../engine/debug/Debug";

class MapEditor extends HandlerBase{

    constructor() {

        super();

        TileHandler.loadTilePrefabs();

        this.loadedTiles = [];
        this.oldTileHower = "";

        this._brushes = [

            new SquareBrush(3),
            // new CircleBrush(7),
            // new RandomBrush(6),
        ]

        this._activeBrush = this._brushes[0];
        this.loadTiles(this._activeBrush.getLength());

        this.editing = false;
        // this.updateTile();
    }

    loadTiles(count) {

        while (this.loadedTiles.length != count) {

            if (this.loadedTiles.length < count) {

                let newTile = this.getActiveTileClone();
                this.loadedTiles.push(newTile);
                Handler.addObj(newTile, ["temp_tile"]);
            }

            else if (this.loadedTiles.length > count) {

                const removedTiles = this.loadedTiles.splice(count, 1);

                for (const tile of removedTiles) {

                    Handler.removeObj(tile);
                }

                // Handler.addObj(newTile, ["temp_tile"]);
            }
        }
    }

    applyLoadedTiles() {

        for (const tile of this.loadedTiles) {

            MapHandler.setTile(tile.clone());
        }
    }

    getActiveTileClone() {

        return TileHandler.getCurrentTile();
    }

    tick() {

        if(!this.editing)
            return;
        
        this.loadTiles(this._activeBrush.getLength());

        const tilePos = Renderer.screenToTilePos(MouseInput.mousePos);
        const targetTilePositions = this._activeBrush.getAffectedTiles(tilePos);

        if (targetTilePositions.length > 0 && !targetTilePositions[0].equals(this.oldTileHower)) {

            for (let i = 0; i < targetTilePositions.length; i++) {
                const tilePos = targetTilePositions[i];

                this.loadedTiles[i].position.x = tilePos.x;
                this.loadedTiles[i].position.y = tilePos.y;
            }
        }

        if (targetTilePositions.length > 0)
            this.oldTileHower = targetTilePositions[0].clone();

        this.checkForTileImageReselection();

        // if (KeyboardInput.getKeyUp("Enter")) {
        if (MouseInput.getIsDown(0)) {

            this.applyLoadedTiles();
        }

        if (!KeyboardInput.getKeyIsDown("Shift")) {

            if (MouseInput._scroll > 0) {

                this._activeBrush._size++;
                this.oldTileHower = "";
            }
            if (MouseInput._scroll < 0) {
                this._activeBrush._size--;
                this.oldTileHower = "";
            }
        }
    }

    setLoadedTilesImage() {

        const newTiles = [];

        for (let i = 0; i < this.loadedTiles.length; i++) {

            // const tile = this.loadedTiles[i];
            // const newTile = ;
            newTiles.push(this.getActiveTileClone());
            Handler.addObj(newTiles[i], ["temp_tile"]);
        }

        for (let i = 0; i < this.loadedTiles.length; i++) {
            const tile = this.loadedTiles[i];

            Handler.removeObj(tile, ["temp_tile"]);
        }

        this.loadedTiles = newTiles;
    }

    /**
     * Check if user have pressed a key to change the current tile image.
     */
    checkForTileImageReselection() {

        // const delta = KeyboardInput.getKeyUp("ArrowLeft") ? - 1 : KeyboardInput.getKeyUp("ArrowRight") ? 1 : 0;
        let delta = 0;
        
        if (KeyboardInput.getKeyIsDown("Shift"))
            delta = MouseInput._scroll > 0 ? - 1 : MouseInput._scroll < 0 ? 1 : 0;

        TileHandler.moveSelectedIndex(delta);

        if (delta != 0) {

            this.oldTileHower = "";
            this.setLoadedTilesImage();
        }
    }

    render(ctx) {
        //Dont remove even if emtpy. Needed for Handler to work.
    }
}

export default new MapEditor();