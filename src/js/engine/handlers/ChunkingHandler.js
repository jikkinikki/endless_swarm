import MapHandler from "../../map/MapHandler";
import Vector2, { Vector2_zero } from "../Tools/Vector2";
import Obj from "../Tools/Obj";
import HandlerBase from "./HandlerBase";
import { Handler } from "../../imports";
import Renderer from "./Renderer";
import MouseInput from "../inputs/MouseInput";
import handler from "./Handler";
import Monster from "src/js/entities/Monster";
import Ent from "src/js/entities/Ent";

class ChunkingHandler extends HandlerBase {
    constructor() {
        super();
        this._tileSize = MapHandler.getTileSize();
        this._chunkSize = new Vector2(1, 1);
        this._chunkCount = MapHandler.mapSize.clone().scale(1 / this._chunkSize.x).ceil();

        this._chunks = new Map();
        this._objToChunk = new Map();

        // Pre-allocate vectors for reuse
        this._vectorCache = new Vector2();
        this._neighborCache = new Array(9).fill(null).map(() => new Vector2());
        this._objectsToRemove = []; // Pre-allocate array for removals
        this._currentObjects = new Set(); // Reuse Set for current objects
        this._tickCount = 0;
        // Initialize chunks
        this._initializeChunks();
    }

    _initializeChunks() {
        this._chunks.clear();
        const { x: countX, y: countY } = this._chunkCount;

        // Pre-calculate all chunk keys
        for (let x = 0; x < countX; x++) {
            for (let y = 0; y < countY; y++) {
                const key = `${x},${y}`;
                this._chunks.set(key, new Set());
            }
        }
    }

    _posToChunk(pos) {
        return this._vectorCache.setxy(
            Math.floor((pos.x + this._tileSize / 2) / (this._tileSize * this._chunkSize.x)),
            Math.floor((pos.y + this._tileSize / 2) / (this._tileSize * this._chunkSize.y))
        );
    }

    _getChunkKey(chunkPos) {
        return `${chunkPos.x},${chunkPos.y}`;
    }

    _getNeighbourChunks(chunkPos, maxChunkDist = 1) {
        const neighbors = [];
        const { x, y } = chunkPos;
        const countX = this._chunkCount.x;
        const countY = this._chunkCount.y;

        // Calculate chunk range based on maxChunkDist
        for (let dx = -maxChunkDist; dx <= maxChunkDist; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= countX) continue;

            for (let dy = -maxChunkDist; dy <= maxChunkDist; dy++) {
                const ny = y + dy;
                if (ny < 0 || ny >= countY) continue;

                const key = `${nx},${ny}`;
                const chunk = this._chunks.get(key);
                if (chunk) {
                    neighbors.push(chunk);
                }
            }
        }

        return neighbors;
    }


    _getNeighbourChunkPoses(chunkPos, maxChunkDist = 1) {
        const poses = [];
        const { x, y } = chunkPos;
        const countX = this._chunkCount.x;
        const countY = this._chunkCount.y;

        // Calculate chunk range based on maxChunkDist
        for (let dx = -maxChunkDist; dx <= maxChunkDist; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= countX) continue;

            for (let dy = -maxChunkDist; dy <= maxChunkDist; dy++) {
                const ny = y + dy;
                if (ny < 0 || ny >= countY) continue;

                const key = `${nx},${ny}`;
                const chunk = this._chunks.get(key);

                if (chunk) {
                    poses.push({ x: nx, y: ny });
                }
            }
        }

        return poses;
    }

    _calculateMaxChunkDistance(maxDist) {
        const chunkWidth = this._tileSize * this._chunkSize.x;
        const chunkHeight = this._tileSize * this._chunkSize.y;
        return Math.ceil(maxDist / Math.max(chunkWidth, chunkHeight));
    }

    _updateObjectChunk(obj) {
        if (!obj?.position) return;

        let objPos = obj.classes.has(Ent) ? obj.getFeetPos() : obj.position;
        // console.log(obj.classes.has(Ent));
        
        const oldChunkKey = this._objToChunk.get(obj);
        const newChunkPos = this._posToChunk(objPos);
        const newChunkKey = this._getChunkKey(newChunkPos);

        // Only update if chunk changed
        if (oldChunkKey !== newChunkKey) {
            if (oldChunkKey) {
                const oldChunk = this._chunks.get(oldChunkKey);
                oldChunk?.delete(obj);
            }

            const newChunk = this._chunks.get(newChunkKey);
            if (newChunk) {
                newChunk.add(obj);
                this._objToChunk.set(obj, newChunkKey);
            }
        }
    }

    _removeObject(obj) {
        if (!obj) return;

        // First remove from the tracked chunk
        const chunkKey = this._objToChunk.get(obj);
        if (chunkKey) {
            const chunk = this._chunks.get(chunkKey);
            chunk?.delete(obj);
            this._objToChunk.delete(obj);
        }

        // Then do a full cleanup of all chunks
        for (const [key, chunk] of this._chunks) {
            if (chunk.has(obj)) {
                chunk.delete(obj);
                if (key !== chunkKey) {
                    this._objToChunk.delete(obj);
                }
            }
        }
    }

    getWorldObjects() {
        const objects = new Set();
        for (const chunk of this._chunks.values()) {
            for (const obj of chunk) {
                objects.add(obj);
            }
        }
        return Array.from(objects);
    }

    getNearbyObjs(sourceObj, maxDist = this._tileSize * this._chunkSize.x * 1.5) {
        if (!sourceObj?.position) return [];

        const sourcePos = sourceObj.classes.has(Ent) ? sourceObj.getFeetPos() : sourceObj.position;
        const chunkPos = this._posToChunk(sourcePos);
        const maxChunkDist = this._calculateMaxChunkDistance(maxDist);
        const neighbors = this._getNeighbourChunks(chunkPos, maxChunkDist);
        const nearbyObjs = new Set();
        const maxDistSquared = maxDist * maxDist;
        const sourceX = sourcePos.x;
        const sourceY = sourcePos.y;

        for (const chunk of neighbors) {
            for (const obj of chunk) {
                if (obj && obj !== sourceObj) {
                    const objPos = obj.classes && obj.classes.has(Ent) ? obj.getFeetPos() : obj.position;
                    const dx = objPos.x - sourceX;
                    const dy = objPos.y - sourceY;
                    if (dx * dx + dy * dy <= maxDistSquared) {
                        nearbyObjs.add(obj);
                    }
                }
            }
        }

        return Array.from(nearbyObjs);
    }

    getNearbyObjsByClass(sourceObj, classFilter = Obj, maxDist = this._tileSize * this._chunkSize.x * 1.5) {
        if (!sourceObj?.position) return [];

        const sourcePos = sourceObj.classes.has(Ent) ? sourceObj.getFeetPos() : sourceObj.position;
        const chunkPos = this._posToChunk(sourcePos);
        const maxChunkDist = this._calculateMaxChunkDistance(maxDist);
        const neighbors = this._getNeighbourChunks(chunkPos, maxChunkDist);
        const nearbyObjs = new Set();
        const maxDistSquared = maxDist * maxDist;
        const sourceX = sourcePos.x;
        const sourceY = sourcePos.y;

        for (const chunk of neighbors) {
            for (const obj of chunk) {

                if (obj && obj !== sourceObj && (obj.classes.has(classFilter))) {
                    const objPos = obj.classes && obj.classes.has(Ent) ? obj.getFeetPos() : obj.position;
                    const dx = objPos.x - sourceX;
                    const dy = objPos.y - sourceY;
                    if (dx * dx + dy * dy <= maxDistSquared) {
                        nearbyObjs.add(obj);
                    }
                }
            }
        }

        return Array.from(nearbyObjs);
    }

    //TODO: Use pointers for each node so we dont have to find cheapest neighbour every time.
    getPosTowardsPlayer(currPos) {

        const player = handler.getPlayers()[0];
        const data = this.getPathToPlayer(player);
        const chunkPos = this._posToChunk(currPos);
        let entCostLimit = 1;
        
        let cheapestPos = null;
        let cheapestCost = 0;
        let entCost = 0;
        
        let neighbours = this._getNeighbourChunkPoses(chunkPos);
        
        for (const neighbour of neighbours) {

            if ((data[neighbour.x][neighbour.y].cost < cheapestCost || cheapestPos === null) && data[neighbour.x][neighbour.y].entCost < entCostLimit) {
                cheapestPos = neighbour;
                cheapestCost = data[neighbour.x][neighbour.y].cost;
                entCost = data[neighbour.x][neighbour.y].entCost;
            }
        }

        if(cheapestPos == null || entCost > entCostLimit) {
            return null;
        }

        return MapHandler.tileToWorldPos(new Vector2(cheapestPos.x, cheapestPos.y), true);
    }
    
    /**
     * 
     * @param {Vector2} chunkPos 
     * @param {class} classFilter check if object is instance of classFilter
     * @param {boolean} cloneArr 
     * @returns 
     */
    getObjsInChunk(chunkPos, classFilter, cloneArr = true) {


        if(cloneArr) {
            let set = this._chunks.get(this._getChunkKey(chunkPos));
            return Array.from(set).filter(obj => obj instanceof classFilter).map(obj => obj.clone());
        }
        else {

            let set = this._chunks.get(this._getChunkKey(chunkPos));
            return Array.from(set).filter(obj => obj instanceof classFilter);
        }
    }

    tick() {
     
        // this._tickCount++;
        // if(this._tickCount % 1 == 0)
        this._calculate();
    }

    _calculate(){

        const objects = Handler.getObjsByInstance(Obj);

        // Reuse Set for current objects
        this._currentObjects.clear();
        for (const obj of objects) {
            this._currentObjects.add(obj);
        }

        // Collect objects to remove
        this._objectsToRemove.length = 0;
        for (const [obj, _] of this._objToChunk) {
            if (!this._currentObjects.has(obj)) {
                this._objectsToRemove.push(obj);
            }
        }

        // Remove objects that are no longer in the main Handler
        for (const obj of this._objectsToRemove) {
            this._removeObject(obj);
        }

        // Update or add new objects
        for (const obj of objects) {

            if (obj?.position) {
                this._updateObjectChunk(obj);
            }
        }

        this._verifyChunks();
        this._calculatePathToPlayers();
    }

    _calculatePathToPlayers() {

        this._player_paths = new Map();

        for (const player of handler.getPlayers()) {

            const playerchunk = this._posToChunk(player.getFeetPos());

            const result = this._calculate_path(playerchunk);
            this._player_paths.set(player, result);
        }
    }

    //TODO: Move it its own file.
    _calculate_path(targetChunk) {

        const result = this._empty_chunk_path_data();

        // const checked = [];
        const check = [targetChunk];
        let nextup;
        let neighbours;
        let entCost;
        let blocked;

        result[targetChunk.x][targetChunk.y].cost = 0;

        while (check.length > 0) {

            nextup = check.shift();
            // console.log(nextup);
            
            // checked.push

            neighbours = this._getNeighbourChunkPoses(nextup);
            // console.log(neighbours);

            for (const neighbour of neighbours) {


                if (!MapHandler.getIsWalkable(neighbour, true)) {

                    blocked = true;
                    entCost = 0;
                }
                else {

                    blocked = false;
                    entCost = this.getObjsInChunk(neighbour, Monster, false).length;
                }

                let deltaX = neighbour.x - nextup.x;
                let deltaY = neighbour.y - nextup.y;

                const addedCost = deltaX != 0 && deltaY != 0 ? 1.5 : 1;

                const cost = entCost * 4 + result[nextup.x][nextup.y].cost + (blocked ? 1000 : 0) + addedCost;

                if (cost < result[neighbour.x][neighbour.y].cost || result[neighbour.x][neighbour.y].cost === -1) {

                    result[neighbour.x][neighbour.y] = {
                        cost: cost,
                        blocked: blocked,
                        entCost: entCost
                    };

                    if (!blocked)
                        check.push(neighbour);
                }
            }
        }

        // result[targetChunk.x][targetChunk.y].cost = 0;
        result[targetChunk.x][targetChunk.y].entCost = 100;

        return result;
    }

    _empty_chunk_path_data() {

        const data = [];

        for (let x = 0; x < this._chunkCount.x; x++) {

            let row = [];

            for (let y = 0; y < this._chunkCount.y; y++)
                row.push({
                    cost: -1,
                    blocked: false,
                    entCost: 0
                });

            data.push(row);
        }

        return data;
    }

    getPathToPlayer(player) {

        if (!this._player_paths)
            this._calculatePathToPlayers();

        return this._player_paths.get(player);
    }

    _verifyChunks() {
        const { x: countX, y: countY } = this._chunkCount;

        // Ensure all chunks exist
        for (let x = 0; x < countX; x++) {
            for (let y = 0; y < countY; y++) {
                const key = `${x},${y}`;
                if (!this._chunks.has(key)) {
                    this._chunks.set(key, new Set());
                }
            }
        }

        // Remove any chunks that shouldn't exist
        for (const [key, _] of this._chunks) {
            const [x, y] = key.split(',').map(Number);
            if (x < 0 || x >= countX || y < 0 || y >= countY) {
                this._chunks.delete(key);
            }
        }
    }

    render(ctx) {
        // this._drawChunkLines(ctx);
        // this._drawPathCost(ctx);
    }

    _drawPathCost(ctx) {

        let player = handler.getPlayers()[0];
        const result = this._player_paths.get(player);
        ctx.fillStyle = "green";

        for (let x = 0; x < this._chunkCount.x; x++) {
            for (let y = 0; y < this._chunkCount.y; y++) {
         
                if(result[x][y].blocked || result[x][y].cost === -1)
                    continue;

                const cost = result[x][y].cost;
                // ctx.fillRect(x * this._tileSize * this._chunkSize.x, y * this._tileSize * this._chunkSize.y, this._tileSize * this._chunkSize.x, this._tileSize * this._chunkSize.y);
            
                const pos = Renderer.worldPosToDrawPos(new Vector2(x * this._tileSize * this._chunkSize.x, y * this._tileSize * this._chunkSize.y));

                ctx.fillText(cost, pos.x, pos.y);
            }
        }
    }

    _drawChunkLines(ctx) {
        const chunkWidth = this._tileSize * this._chunkSize.x;
        const chunkHeight = this._tileSize * this._chunkSize.y;
        const { x: countX, y: countY } = this._chunkCount;

        ctx.strokeStyle = 'rgb(33, 35, 54)';
        ctx.lineWidth = 2;

        // Draw vertical lines
        for (let x = 0; x <= countX; x++) {
            const worldPos = new Vector2(x * chunkWidth + chunkWidth / 2, -chunkWidth / 2);
            const startPos = Renderer.worldPosToDrawPos(worldPos);
            const endPos = Renderer.worldPosToDrawPos(new Vector2(x * chunkWidth + chunkWidth / 2, countY * chunkHeight - chunkWidth / 2));

            ctx.beginPath();
            ctx.moveTo(startPos.x, startPos.y);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y <= countY; y++) {
            const worldPos = new Vector2(-chunkWidth / 2, y * chunkHeight + chunkWidth / 2);
            const startPos = Renderer.worldPosToDrawPos(worldPos);
            const endPos = Renderer.worldPosToDrawPos(new Vector2(countX * chunkWidth - chunkWidth / 2, y * chunkHeight + chunkWidth / 2));

            ctx.beginPath();
            ctx.moveTo(startPos.x, startPos.y);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.stroke();
        }
    }
}

export default new ChunkingHandler();