//TODO: Shadows does not work correctly when goins far to the right or bottom of map.

import Ray from "../Tools/Ray.js";
import Renderer from "./Renderer.js";
import MapHandler from "../../map/MapHandler.js";
import Vector2 from "../Tools/Vector2.js";
import Handler from "./Handler.js";
import KeyboardInput from "../inputs/KeyboardInput.js";
import MouseInput from "../inputs/MouseInput.js";
import HandlerBase from "./HandlerBase.js";

class ShadowsHandler extends HandlerBase {

    constructor() {
        super();

        this._enableShadows = false;
        this._hideEntitiesInShadow = false;
        this._lightSources = [];
        this._shadowCanvas = document.createElement('canvas');
        this._shadowCtx = this._shadowCanvas.getContext('2d');
        this._shadowCanvas.width = window.innerWidth;
        this._shadowCanvas.height = window.innerHeight;

        this._lightDataFlat = [];
        this._lightDataPerSource = [];

        this._detail = 3;
        this._subSteps = 2;
        this._maxDarkness = .2;
        this._minDarkness = .1;

        //Has to be lower then this brightenSpeed!
        this._darkenSpeed = 1;
        this._brightenSpeed = 1;

        this._lastTime = Date.now()
        this._deltaTime = 0;

        this._logArea = new Vector2(0, 0);
        this._doLog = false;

        this._vector2Cache = new Vector2(0, 0);

        this._counter = 0;

        this._multiVals = [0, 0]
        this._multiVals2 = [0, 0]

        // this._subTileSize = 32 / this._detail;
        // this._subTileSize = MapHandler.getTileSize() / this._detail;
    }

    get _subTileSize() {

        return MapHandler.getTileSize() / this._detail;
    }

    getPosInShadow(pos) {

        if (!this._enableShadows)
            return false;

        if (!this._hideEntitiesInShadow)
            return false;

        pos.x = Math.max(0, pos.x);
        pos.y = Math.max(0, pos.y);

        pos.x = Math.min(this._shadowCanvas.width, pos.x);
        pos.y = Math.min(this._shadowCanvas.height, pos.y);

        // const tilePos = MapHandler.worldToTilePos(pos, true, this._detail);
        this.posTo_SubTile_Pos(pos.x, pos.y, this._multiVals);

        return this._lightDataFlat[this._multiVals[0]][this._multiVals[1]] >= this._maxDarkness;
    }

    emptyWallData() {

        this._wallData = []

        for (let i = 0; i < MapHandler.mapSize.x * this._detail; i++) {

            let sub = [];

            for (let y = 0; y < MapHandler.mapSize.y * this._detail; y++) {

                sub.push(null);
            }

            this._wallData.push(sub);
        }
    }

    mousePosToSubTilePos() {

        let pos = Renderer.screenToWorldPos(MouseInput.mousePos);

        this.posTo_SubTile_Pos(pos.x, pos.y, this._multiVals);
        return new Vector2(this._multiVals[0], this._multiVals[1]);
    }

    tick() {

        if (!this._enableShadows)
            return;

        this._subTileMousePos = this.mousePosToSubTilePos();

        // const xpDisp = Handler.getEntitiesByTag("XP_DISP")[0];
        // let subTilePos = this.mousePosToSubTilePos();
        // xpDisp.setText(subTilePos.x + ", " + subTilePos.y);

        this.emptyWallData();

        // Update light sources if needed
        // this._lightSources = this._lightSources.filter(light => light._owner && light._owner.active);
        this._lightSources = Handler.lightSources;

        this._deltaTime = Date.now() - this._lastTime;
        this._lastTime = Date.now();

        if (KeyboardInput.getKeyUp("v")) {
            this._detail++;

            this._lightDataFlat = this.loadEmptyLightData();
        }

        if (KeyboardInput.getKeyUp("b")) {
            this._detail--;
            this._lightDataFlat = this.loadEmptyLightData();
        }

        if (this._detail < 1)
            this._detail = 1;

        if (KeyboardInput.getKeyUp("x")) {

            const checkPos = Renderer.screenToWorldPos(MouseInput.mousePos);
            const tilePosPart = MapHandler.worldToTilePos(checkPos, true, this._detail);
            const tilePosFull = MapHandler.worldToTilePos(checkPos, true, 1);

            console.log(tilePosPart.toString(), tilePosFull.toString());
            console.log(this._lightDataFlat[tilePosPart.x][tilePosPart.y]);
            console.log("- - - - -");

            this._logArea.setxy(tilePosFull.x, tilePosFull.y);

            console.log(this._logArea.toString());

            this._doLog = true;
        }

        if (this._enableShadows) {

            if (this._counter % 1 == 0)
                this.renderRayTileVersion();

            this.lightupWalls();
        }

        this._counter++;
    }

    render(ctx) {
        if (!this._enableShadows) return;

        ctx.save();

        for (let x = 0; x < this._wallData.length; x++) {

            for (let y = 0; y < this._wallData[0].length; y++) {

                if (this._wallData[x][y] == null)
                    continue;

                // console.log(x, y);

                // let pos = Renderer.worldPosToDrawPos(MapHandler.tileToWorldPos(new Vector2(x, y)));
                let valsArr = this.subTileToPos(x, y);

                let pos = new Vector2(valsArr[0], valsArr[1]);

                pos = Renderer.worldPosToDrawPos(pos);

                if (this._wallData[x][y])
                    ctx.fillStyle = "red";
                else
                    ctx.fillStyle = "blue";

                ctx.fillRect(pos.x, pos.y, 5, 5);

                // console.log("---");
            }
        }

        this.drawLightData(ctx);
    }

    loadEmptyLightData() {

        const lightDataFlat = [];

        for (let x = 0; x < MapHandler.mapSize.x * this._detail; x++) {

            const row = [];

            for (let y = 0; y < MapHandler.mapSize.y * this._detail; y++) {

                row.push(this._maxDarkness);
            }

            lightDataFlat.push(row);
        }

        return lightDataFlat;
    }

    deltaTileLight(x, y, delta) {
        // console.log(x, y, delta);

        if (x < 0 || y < 0) {

            // console.trace("less", x, y)
            // console.log(x, y);

            return;
        }

        if (isNaN(x) || isNaN(y)) {

            console.log("nan")
            return;
        }

        if (x >= this.getMapSize().x || y >= this.getMapSize().y)
            return;

        this._lightDataFlat[x][y] += delta * (this._deltaTime / 1000);
        // this._lightDataFlat[x][y] = Math.max(0, Math.min(this._lightDataFlat[x][y], this._baseDarkness));
        this.setTileLight(x, y, this._lightDataFlat[x][y]);
    }

    setTileLight(x, y, light) {
        this._lightDataFlat[x][y] = Math.max(this._minDarkness, Math.min(light, this._maxDarkness));
    }

    reDarkenLightData() {

        for (let x = 0; x < this.getMapSize().x; x++) {
            for (let y = 0; y < this.getMapSize().y; y++) {

                if (this._lightDataFlat[x][y] < this._maxDarkness)
                    this.deltaTileLight(x, y, this._darkenSpeed);
            }
        }
    }

    lightupWalls() {

        for (let x = 0; x < this.getMapSize().x; x++) {
            for (let y = 0; y < this.getMapSize().y; y++) {

                const tilePos = new Vector2(Math.floor(x / this._detail), Math.floor(y / this._detail));
                const offset = new Vector2(x % this._detail, y % this._detail);

                if (offset.y != 0)
                    continue;

                if (MapHandler.getIsWalkable(tilePos.clone(), true) && this._lightDataFlat[x][y] < this._maxDarkness) {

                    const aboveTilePos = tilePos.clone().addxy(0, -1);

                    while (MapHandler.isTilePosInsideMap(aboveTilePos) && !MapHandler.getIsWalkable(aboveTilePos, true)) {

                        for (let wallOffsetY = 0; wallOffsetY < this._detail; wallOffsetY++)
                            this.setTileLight(aboveTilePos.x * this._detail + offset.x, aboveTilePos.y * this._detail + wallOffsetY, this._lightDataFlat[x][y]);

                        aboveTilePos.addxy(0, -1);
                    }
                }

            }
        }
    }

    getAllCheckPosesList() {

        const checkPoses = [];

        //TODO Fix so its no more then camera edges. SO entire map does not have to be rendered.
        for (let x = 0; x < this.getMapSize().x; x++) {

            checkPoses.push(this.subTileToPos(x, 0));
            checkPoses.push(this.subTileToPos(x, this.getMapSize().y - 1));
        }

        for (let y = 1; y < this.getMapSize().y - 1; y++) {

            checkPoses.push(this.subTileToPos(0, y));
            checkPoses.push(this.subTileToPos(this.getMapSize().x - 1, y));
        }

        return checkPoses;
    }

    renderRayTileVersion(ctx) {

        if (this._lightDataFlat.length == 0)
            this._lightDataFlat = this.loadEmptyLightData();

        this.reDarkenLightData();

        for (const light of this._lightSources) {

            this.applyLightOnPoses(light);
        }
    }

    applyLightOnPoses(light) {

        let checkPoses = this.getAllCheckPosesList();
        const max = checkPoses.length;

        console.log("max worst", max);

        for (const targetPosTile of checkPoses) {

            let targetPos = targetPosTile;
            let lightPosArr = [light.position.x, light.position.y];

            let doLog = false;

            if (Math.random() > 1.5)
                doLog = true;

            let resultSet = this.checkLightReach(lightPosArr, targetPos, doLog);

            let checkPos;

            for (const key of ["notReachable", "reachable"]) {

                let deltaVal = key == "reachable" ? -this._brightenSpeed : 0;

                for (let i = 0; i < resultSet[key].length; i += 2) {

                    let result = resultSet[key]

                    this.posTo_SubTile_Pos(result[i], result[i + 1], this._multiVals2);
                    this.deltaTileLight(this._multiVals2[0], this._multiVals2[1], deltaVal);
                }
            }

        }
    }

    posTo_TILE_Pos(x, y, holder) {

        holder[0] = Math.floor(x / MapHandler.getTileSize());
        holder[1] = Math.floor(y / MapHandler.getTileSize());
    }

    posTo_SubTile_Pos(x, y, holder) {

        // x = Math.max(0, x);
        // y = Math.max(0, y);

        holder[0] = Math.floor(x / this._subTileSize);
        holder[1] = Math.floor(y / this._subTileSize);
    }

    // return pos.clone().scale(tileSize * Renderer.getZoom() / 2);
    subTileToPos(x, y) {

        return [
            x * this._subTileSize,
            y * this._subTileSize
        ];
    }

    comparePos(pos1, pos2) {

        return pos1[0] == pos2[0] && pos1[1] == pos2[1];
    }

    /**
     * 
     * @param {Number[2]} to World position
     * @param {Number[2]} from World positions
     * @param {Boolean} doLog 
     * @returns {Object}
     */
    checkLightReach(to, from, doLog = false) {

        this.posTo_SubTile_Pos(from[0], from[1], this._multiVals);

        to[0] = Math.round(to[0] / this._subTileSize * this._subSteps) * this._subTileSize / this._subSteps;
        to[1] = Math.round(to[1] / this._subTileSize * this._subSteps) * this._subTileSize / this._subSteps;

        if (this._multiVals[0] == this._subTileMousePos.x && this._multiVals[1] == this._subTileMousePos.y)
            doLog = true;
        // else if (false)
        //     return {

        //         reachable: [],
        //         notReachable: []
        //     }

        const notReachable = [];
        const reachable = [];

        // Calculate distance
        const distance = Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2)) - this._subTileSize;
        const dir = Math.atan2(- from[1] + to[1], - from[0] + to[0]);

        // Convert to grid coordinates
        const startX = Math.floor(from[0]);
        const startY = Math.floor(from[1]);

        // Calculate direction vector
        const dirX = Math.cos(dir);
        const dirY = Math.sin(dir);

        // Calculate step size and initial error
        const stepX = Math.sign(dirX);
        const stepY = Math.sign(dirY);

        const deltaX = Math.abs(1 / dirX);
        const deltaY = Math.abs(1 / dirY);

        let tMaxX = (stepX > 0) ? (startX + 1 - from[0]) / dirX : (startX - from[0]) / dirX;
        let tMaxY = (stepY > 0) ? (startY + 1 - from[1]) / dirY : (startY - from[1]) / dirY;

        let currentX = startX;
        let currentY = startY;
        let currentDist = 0;
        let subTilePos;
        let pos;

        while (currentDist <= distance) {

            pos = this._vector2Cache.setxy(currentX, currentY);

            this.posTo_TILE_Pos(pos.x, pos.y, this._multiVals);

            if (doLog) {

                this.posTo_SubTile_Pos(pos.x, pos.y, this._multiVals2);
                subTilePos = new Vector2(this._multiVals2[0], this._multiVals2[1]);
            }

            pos.setxy(this._multiVals[0], this._multiVals[1]);

            if (!MapHandler.getIsWalkable(pos, true)) {

                if (doLog)
                    this._wallData[subTilePos.x][subTilePos.y] = false;

                for (let i = 0; i < reachable.length; i += 2) {
                    notReachable.push(reachable[i], reachable[i + 1]);
                }

                this.addPosIfNextNotSame(currentX, currentY, notReachable);

                reachable.length = 0;
            }
            else {
                if (doLog)
                    this._wallData[subTilePos.x][subTilePos.y] = true;

                this.addPosIfNextNotSame(currentX, currentY, reachable);
            }

            // Move to next tile
            if (tMaxX < tMaxY) {
                currentX += stepX * this._subTileSize / this._subSteps;
                currentDist = tMaxX;
                tMaxX += deltaX * this._subTileSize / this._subSteps;
            } else {
                currentY += stepY * this._subTileSize / this._subSteps;
                currentDist = tMaxY;
                tMaxY += deltaY * this._subTileSize / this._subSteps;
            }
        }

        return {
            reachable: reachable,
            notReachable: notReachable
        };
    }

    addPosIfNextNotSame(x, y, list) {

        // this.posTo_SubTile_Pos(x, y, this._multiVals)
        // this.posTo_SubTile_Pos(list[list.length - 2], list[list.length - 1], this._multiVals2)

        // if (list.length == 0 || !this.comparePos(this._multiVals, this._multiVals2)) {
        list.push(x, y);
        // }

        // this.posToSubTilePos(currentX, currentY, this._multiVals)
        // this.posToSubTilePos(reachable[reachable.length - 2], reachable[reachable.length - 1], this._multiVals2)

        // if (reachable.length == 0 || !this.comparePos(this._multiVals, this._multiVals2)) {
        //     reachable.push(currentX, currentY);
        // }
    }

    drawLightData(ctx) {

        const tileworld = new Vector2(0, 0);

        for (let tileX = 0; tileX < MapHandler.mapSize.x; tileX++) {
            for (let tileY = 0; tileY < MapHandler.mapSize.y; tileY++) {

                tileworld.setxy(tileX, tileY);
                MapHandler.tileToWorldPos(tileworld, true);

                if (!Handler.isInsideCamera(tileworld, new Vector2(16, 16)))
                    continue;

                const tileworldDraw = Renderer.worldPosToDrawPos(tileworld);

                for (let offsetX = 0; offsetX < this._detail; offsetX++) {
                    for (let offsetY = 0; offsetY < this._detail; offsetY++) {

                        let gridX = tileX * this._detail + offsetX;
                        let gridY = tileY * this._detail + offsetY;

                        let shadowValue = this._lightDataFlat[gridX][gridY];

                        if (this._doLog && this._logArea.equals(new Vector2(tileX, tileY))) {
                            console.log(shadowValue);
                        }

                        let offsetDrawX = offsetX * (this._subTileSize) - 16;
                        let offsetDrawY = offsetY * (this._subTileSize) - 16;

                        this.drawSubTile(ctx, tileworldDraw, offsetDrawX, offsetDrawY, shadowValue, false);
                    }
                }

                if (this._doLog && this._logArea.equals(new Vector2(tileX, tileY))) {
                    console.log("--------------------------------");
                    this._doLog = false;
                }
            }
        }
    }

    drawSubTile(ctx, tileworldDraw, offsetX, offsetY, opacity, doLog) {

        ctx.fillStyle = `rgba(0, 0, 20, ${opacity})`;

        const drawX = tileworldDraw.x + offsetX;
        const drawY = tileworldDraw.y + offsetY;

        if (opacity == 0) return;

        ctx.fillRect(
            drawX,
            drawY,
            this.getPointSize() / 2,
            this.getPointSize() / 2
        );
    }

    getMapSize() {

        return MapHandler.mapSize.clone().scale(this._detail);
    }

    getPointSize() {
        return 16 * Renderer.getZoom() / this._detail;
    }

    posCanSeeTile(pos, tilePos) {
        const ray = new Ray().posToPos(pos, tilePos);
        const hits = ray.getTileCollisions(-1, true);
        return hits.length > 0;
    }

    clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }
}

export default new ShadowsHandler();