/**
 * Used for Map editor to make changes, load and save map data to a file.
 */

import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";
import Vector2 from "../engine/Tools/Vector2";
import floor1 from "./../../textures/map/floor1.png";

import map1_tiles from "./../../textures/tiles.png"
import Tile from "./Tile";
import Handler from "../engine/handlers/Handler";
import KeyboardInput from "../engine/inputs/KeyboardInput";
import TileHandler from "./TileHandler";
import TimeHandler from "../engine/handlers/TimeHandler";
import HandlerBase from "../engine/handlers/HandlerBase";

class MapHandler extends HandlerBase {

    constructor() {

        super();

        this.floor1 = new Animation(floor1, 1, Renderer.speed);
        this.lastPathUpdate = 0;

        this.tilemapTexture = map1_tiles;
        this.loadedMap = [];
        this.ready = false;

        this._animData = new Animation(map1_tiles, 1, 1, 1);
        this.mapSize = new Vector2(40, 40);

        this._tilePosesBuffer = [];
    }

    loadEmptyMap() {

        this.ready = true;
        // this.mapSize = new Vector2(15, 15);
        this.loadedMap = [];

        for (let x = 0; x < this.mapSize.x; x++) {

            const row = [];

            for (let y = 0; y < this.mapSize.x; y++) {

                const pos = new Vector2(x, y).scale(16).scale(this._animData.scale);

                if (Math.random() < 0.9)
                    row.push(new Tile(pos, map1_tiles, 1, 4));
                // row.push(new Tile(pos, map1_tiles, 0, 0));
                else
                    // row.push(new Tile(pos, map1_tiles, 0, 0));
                    row.push(new Tile(pos, map1_tiles, 2, 5));

                Handler.addObj(row[row.length - 1], ["map"]);
            }

            this.loadedMap.push(row);
        }
    }

    /**
     * @param {Tile} newTile 
     */
    setTile(newTile) {

        const arrayPosition = newTile.position.clone().scale(1 / 16).scale(1 / new Animation(map1_tiles).scale);
        // const selectedTile = this.loadedMap[arrayPosition.x][arrayPosition.y];
        // selectedTile.setAnim(newTile.getAnim().path, newTile.getOffset().x, newTile.getOffset().y)

        if (arrayPosition.x < 0 || arrayPosition.x >= this.mapSize.x || arrayPosition.y < 0 || arrayPosition.y >= this.mapSize.y)
            return;

        Handler.addObj(newTile, ["map"]);
        Handler.removeObj(this.loadedMap[arrayPosition.x][arrayPosition.y]);

        this.loadedMap[arrayPosition.x][arrayPosition.y] = newTile;
    }

    /**
     * 
     * @param {Vector2} world 
     * @param {Boolean} clone 
     * @returns 
     */
    worldToTilePos(world, clone = true, granularity = 1, mode = "round") {

        if (clone)
            world = world.clone();
        // return world.clone().scale(1 / 16).scale(1 / this._animData.scale).round();

        if (mode == "round")
            return world.scale(1 / (16 / granularity)).scale(1 / this._animData.scale).round();
        else if (mode == "ceil")
            return world.scale(1 / (16 / granularity)).scale(1 / this._animData.scale).ceil();
        else if (mode == "floor")
            return world.scale(1 / (16 / granularity)).scale(1 / this._animData.scale).floor();

        console.log("Invalid mode", mode);

    }

    /**
     * 
     * @param {Vector2} worldPos 
     * @returns 
     */
    getIsWalkable(worldPos, usingTilePosAndNoClone = false) {

        if (!worldPos instanceof Vector2)
            return false;

        // if(worldPos.validateSelf(true))
        // return false;

        // const tilePos = worldPos.clone().scale(1 / 16).scale(1 / new Animation(map1_tiles).scale).round();

        this._tilePosesBuffer.length = 0;
        // let tilePos;

        if (!usingTilePosAndNoClone) {

            this._tilePosesBuffer.push(this.worldToTilePos(worldPos, true, 1, "round"));
            // this._tilePosesBuffer.push(this.worldToTilePos(worldPos, true, 1, "ceil"));
            // this._tilePosesBuffer.push(this.worldToTilePos(worldPos, true, 1, "floor"));
            // tilePos = this.worldToTilePos(worldPos, false, 1, "round");
        }
        else
            // tilePos = worldPos;
            this._tilePosesBuffer.push(worldPos);

        for (let tilePos of this._tilePosesBuffer) {

            if (!this.isTilePosInsideMap(tilePos)) {

                // console.log("outside", tilePos.toString());

                return false;
            }

            if (!this.loadedMap[tilePos.x][tilePos.y].walkable) {

                return false;
            }
        }

        return true;
    }

    clearMap() {
        for (let x = 0; x < this.loadedMap.length; x++) {
            for (let y = 0; y < this.loadedMap[x].length; y++) {
                const tile = this.loadedMap[x][y];
                Handler.removeObj(tile);
            }
        }
        this.loadedMap = [];
    }

    loadMap(map) {

        this.mapSize = new Vector2(map.length, map[0].length);

        this.clearMap();
        this.loadEmptyMap();

        console.log("Loading map: ");

        if (map) {

            for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[x].length; y++) {

                    const tileId = map[x][y];

                    if (tileId != null) {

                        // console.log("'", tileId, "'");

                        const pos = new Vector2(x, y).scale(16).scale(new Animation(map1_tiles).scale);

                        // const tile = new Tile(pos, map1_tiles, tileId, 4);
                        const tile = TileHandler.getTileById(tileId);
                        tile.setPosition(pos);
                        // this.loadedMap[x][y] = tile;
                        this.setTile(tile);

                        // Handler.addObj(tile, ["map"]);
                    }
                }
            }
        }
    }

    getRandomValidSpawnPos() {

        let x = Math.floor(Math.random() * this.mapSize.x);
        let y = Math.floor(Math.random() * this.mapSize.y);

        while (!this.loadedMap[x][y].walkable) {

            x = Math.floor(Math.random() * this.mapSize.x);
            y = Math.floor(Math.random() * this.mapSize.y);
        }

        // return new Vector2(x, y).scale(16).scale(new Animation(map1_tiles).scale);
        return this.tileToWorldPos(new Vector2(x, y));
    }

    tick() {

        if (TimeHandler._lastTime - this.lastPathUpdate > 100) {

            // this.updatePathToPlayers();
            this.lastPathUpdate = TimeHandler._lastTime;
        }

        if (KeyboardInput.getKeyUp("k"))
            this.downloadMap();

        if (KeyboardInput.getKeyUp("l"))
            this.uploadMap();
    }

    downloadMap() {

        const tilesInfo = [];

        for (let x = 0; x < this.loadedMap.length; x++) {

            const row = [];

            for (let y = 0; y < this.loadedMap[x].length; y++) {
                const tile = this.loadedMap[x][y];

                row.push(tile._id);
            }

            tilesInfo.push(row);
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tilesInfo));

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "map.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    uploadMap() {

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {

                    const mapData = JSON.parse(e.target.result);
                    this.loadMap(mapData);

                };
                reader.readAsText(file);
            }
        });

        fileInput.click();
    }

    parseMap() {


    }

    getTileSize() {

        return 16 * Renderer.getZoom() / this._animData.scale;
    }

    tileToWorldPos(pos, dontClone = false) {

        const tileSize = this.getTileSize();

        if (dontClone)
            return pos.scale(tileSize);

        return pos.clone().scale(tileSize);
    }

    isTilePosInsideMap(tilePos) {

        return tilePos.x >= 0 && tilePos.x < this.mapSize.x && tilePos.y >= 0 && tilePos.y < this.mapSize.y;
    }

    getPosTowardsPlayer(currPos) {

        console.warn("getPosTowardsPlayer is deprecated, use ChunkingHandler.getPosTowardsPlayer instead");
        return null;
        
        // const currTilePos = this.worldToTilePos(currPos);

        // console.log(this.pathData);
        
        // if (this.pathData && currTilePos.toString() in this.pathData) {

        //     let pos = this.pathData[currTilePos.toString()].pos;
        //     return this.tileToWorldPos(pos);
        // }

        // return null;
    }

    tilesToData() {

        const mapData = {
            tiles: [],
            size: this.mapSize.toString()
        };

        for (let x = 0; x < this.loadedMap.length; x++) {
            for (let y = 0; y < this.loadedMap[x].length; y++) {

                const tile = this.loadedMap[x][y];

                if (tile) {
                    mapData.tiles.push({ x: tile.position.x, y: tile.position.y, anim: tile.anim.path });
                }
            }
        }

        return mapData;
    }

    // updatePathToPlayers() {

    //     let player = Handler.getPlayers()[0];
    //     let playerPos = this.worldToTilePos(player.getFeetPos());

    //     // const checkedNodes = [playerPos.toString()];
    //     const posesToCheck = [{ pos: playerPos, cost: 0 }];

    //     this.pathData = {};
    //     this.pathData[playerPos.toString()] = {
    //         pos: playerPos.clone(),
    //         cost: 0
    //     };

    //     let i = 0;

    //     while (posesToCheck.length > 0) {

    //         i++;

    //         const posIndex = this.getClosestPos(posesToCheck);
    //         const pos = posesToCheck.splice(posIndex, 1)[0].pos;

    //         const neighbours = this.getNeighbours(pos);

    //         for (let i = neighbours.length - 1; i >= 0; i--) {

    //             const neighbour = neighbours[i];

    //             if (neighbour.x < 0 || neighbour.x >= this.mapSize.x || neighbour.y < 0 || neighbour.y >= this.mapSize.y)
    //                 continue;

    //             if (!this.loadedMap[neighbour.x][neighbour.y].walkable)
    //                 continue;

    //             const addedCost = i < 4 ? 1 : 1.4142;
    //             const cost = this.pathData[pos.toString()].cost + addedCost;

    //             if (!(neighbour.toString() in this.pathData) || this.pathData[neighbour.toString()].cost > cost) {

    //                 // console.log("check it");

    //                 this.pathData[neighbour.toString()] = { pos: pos, cost: cost };
    //                 posesToCheck.push({ pos: neighbour, cost: cost });
    //                 continue;
    //             }

    //             // console.log("noo", neighbour.toString());

    //             // if (!checkedNodes.includes(neighbour.toString())) {

    //             //     checkedNodes.push(neighbour.toString());
    //             // }
    //         }
    //     }

    //     // console.log("check count", i);
    // }

    getClosestPos(poses) {

        let index = -1;
        let closestDist = Infinity;

        let i = 0;
        for (let posData of poses) {

            const dist = posData.cost;

            if (dist < closestDist) {
                closestDist = dist;
                index = i;
            }

            i++;
        }

        return index;
    }

    getNeighbours(pos, checkSurroundingIsNotWall = true) {

        const neighbours = [];

        neighbours.push(new Vector2(pos.x - 1, pos.y));
        neighbours.push(new Vector2(pos.x + 1, pos.y));
        neighbours.push(new Vector2(pos.x, pos.y - 1));
        neighbours.push(new Vector2(pos.x, pos.y + 1));

        let safe = true;

        if(checkSurroundingIsNotWall){

            let neighbours = this.getNeighbours(pos, false);
        
            for (const neighbour of neighbours) {
                
                if(!this.getIsWalkable(neighbour, true)){

                    safe = false
                    break;
                }
            }
        }

        if (safe) {

            neighbours.push(new Vector2(pos.x - 1, pos.y - 1));
            neighbours.push(new Vector2(pos.x + 1, pos.y - 1));
            neighbours.push(new Vector2(pos.x - 1, pos.y + 1));
            neighbours.push(new Vector2(pos.x + 1, pos.y + 1));
        }

        return neighbours;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // this.debugPathfinding(ctx);
    }

    // debugPathfinding(ctx) {

    //     ctx.save();
    //     ctx.beginPath();
    //     ctx.lineWidth = 2;
    //     ctx.fillStyle = "blue";

    //     const scaler = 16 * Renderer.getZoom() / 2;
    //     // const scaler = 1;

    //     if (!this.pathData)
    //         return;

    //     for (let key of Object.keys(this.pathData)) {

    //         let xy = key.replace("(", "").replace(")", "").split(",");
    //         let xyVector = new Vector2(parseInt(xy[0]), parseInt(xy[1]));

    //         xy = Renderer.worldPosToDrawPos(xyVector.scale(scaler))

    //         let to = Renderer.worldPosToDrawPos(this.pathData[key].pos.clone().scale(scaler));

    //         ctx.moveTo(xy.x, xy.y);
    //         ctx.lineTo(to.x, to.y);
    //     }
    //     ctx.stroke();

    //     ctx.restore();
    // }
}

export default new MapHandler();