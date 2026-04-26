import Vector2 from "../engine/Tools/Vector2";
import Tile from "./Tile";
import map1_tiles from "./../../textures/tiles.png"

class TileHandler {

    constructor() {

        this._tileSize = 16;

        // this.loadTilePrefabs();

        this._currentPrefabIndex = 0;
        // this._tileIds = [];
        this.mappedTilePrefabs = {};
    }

    loadTilePrefabs() {

        this._tilePrefabs = [

            new Tile(new Vector2(0, 0), map1_tiles, 1, 1).setId("wall").setWalkable(false),
            new Tile(new Vector2(0, 0), map1_tiles, 1, 4).setId("floor1"),
            new Tile(new Vector2(0, 0), map1_tiles, 2, 5).setId("floor2"),
            new Tile(new Vector2(0, 0), map1_tiles, 0, 0).setId("void").setWalkable(false),
            new Tile(new Vector2(0, 0), map1_tiles, 6, 8).setId("void_top").setWalkable(false),
        ];

        return this;
    }

    removeTileId(id) {

        //check if id exists as key in mappedTIlePrefabs 
        if (this.mappedTilePrefabs[id]) {

            delete this.mappedTilePrefabs[id];
        }
        else {
            console.log("Id: ", id, "does not exist");
        }
    }

    addTileId(newId, tile) {

        if (this.mappedTilePrefabs[newId]) {

            console.log("Id: ", newId, "already exists");
            return;
        }

        this.mappedTilePrefabs[newId] = tile;
    }

    /**
     * 
     * @param {number} id 
     * @returns {Tile} cloned tile, null if id does not exist
     */

    getTileById(id){

        if (!this.mappedTilePrefabs[id]) {
            console.log("Id: ", id, "does not exist");
            console.log("Available ids: ", Object.keys(this.mappedTilePrefabs));
            
            return null;
        }

        return this.mappedTilePrefabs[id].clone();
    }

    getCurrentTile() {

        return this._tilePrefabs[this._currentPrefabIndex].clone();
    }

    moveSelectedIndex(delta) {

        if(delta == 0)
            return;

        if (isNaN(delta))
            console.log(delta + " is NaN");

        this._currentPrefabIndex += delta;

        if (this._currentPrefabIndex < 0) {
            this._currentPrefabIndex = this._tilePrefabs.length - 1;
        } else if (this._currentPrefabIndex >= this._tilePrefabs.length) {
            this._currentPrefabIndex = 0;
        }

        console.log("Current tile: ", this._tilePrefabs[this._currentPrefabIndex]._id);
        

    }
}

export default new TileHandler();