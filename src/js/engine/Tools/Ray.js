import Ent from "../../entities/Ent";
import MapHandler from "../../map/MapHandler";
import Vector2 from "./Vector2";
import handler from "../handlers/Handler";

export default class Ray {

    constructor() {

        this._vector2Cache = new Vector2(0, 0);
        this._x = null;
        this._y = null;
    }

    /**
     * Send ray from pos to pos
     * @param {Vector2} from 
     * @param {Vector2} to 
     */
    posToPos(from, to) {

        this._from = from;
        this._to = to;

        /** @type {Number} */
        this._dir = from.clone().getDir(to);

        return this;
    }

    posToXY(from, x, y) {

        this._from = from;
        this._x = x;
        this._y = y;
        this._dir = from.getDir(new Vector2(x, y));

        return this;
    }

    /**
     * Send ray from pos in direction
     * @param {Vector2} pos 
     * @param {Number} direction 
     */
    posToDir(pos, direction) {

        this._from = pos;
        this._dir = direction;

        return this;
    }

    getTileCollisions(maxDistance = -1, stopOnFirst = false, gridSize = MapHandler.getTileSize(), precision = 4) {
        const collisions = [];

        // Convert from world to tile-space with precision
        const fromX = this._from.x / (gridSize / precision);
        const fromY = this._from.y / (gridSize / precision);

        // Calculate distance in tile-space with precision
        const distance = (this._to && maxDistance == -1) ? this._from.getDist(this._to) / (gridSize / precision)
            : (this._x != null && this._y != null && maxDistance == -1) ? this._from.getDistXY(this._x, this._y) / (gridSize / precision) : maxDistance / (gridSize / precision);

        if (distance === -1) {
            console.log("No distance set");
            return [];
        }

        // const startX = Math.floor(fromX);
        // const startY = Math.floor(fromY);
        const startX = fromX;
        const startY = fromY;

        const dirX = Math.cos(this._dir);
        const dirY = Math.sin(this._dir);

        const stepX = Math.sign(dirX);
        const stepY = Math.sign(dirY);

        const deltaX = Math.abs(1 / dirX);
        const deltaY = Math.abs(1 / dirY);

        let tMaxX = (stepX > 0) ? (startX + 1 - fromX) / dirX : (startX - fromX) / dirX;
        let tMaxY = (stepY > 0) ? (startY + 1 - fromY) / dirY : (startY - fromY) / dirY;

        let currentX = startX;
        let currentY = startY;
        let currentDist = 0;

        while (currentDist <= distance) {
            // Check current tile
            const pos = this._vector2Cache.setxy(currentX / precision, currentY / precision).round();

            if (!MapHandler.getIsWalkable(pos, true)) {
                pos.setxy((currentX / precision) * gridSize, (currentY / precision) * gridSize);

                collisions.push(pos.clone());

                if (stopOnFirst) break;
            }

            // Move to next tile
            if (tMaxX < tMaxY) {
                currentX += stepX;
                currentDist = tMaxX;
                tMaxX += deltaX;
            } else {
                currentY += stepY;
                currentDist = tMaxY;
                tMaxY += deltaY;
            }
        }

        return collisions;
    }

    getEntCollisions(maxDistance = -1, stopOnFirst = false, precision = 4, sender, entType = Ent) {
        const collisions = [];
        const tileSize = MapHandler.getTileSize();

        // Convert from world to tile-space with precision
        const fromX = this._from.x / (tileSize / precision);
        const fromY = this._from.y / (tileSize / precision);

        // Calculate distance in tile-space with precision
        const distance = (this._to && maxDistance == -1) ? this._from.getDist(this._to) / (tileSize / precision)
            : (this._x != null && this._y != null && maxDistance == -1) ? this._from.getDistXY(this._x, this._y) / (tileSize / precision) : maxDistance / (tileSize / precision);

        if (distance === -1) {
            console.log("No distance set");
            return [];
        }

        // const startX = Math.floor(fromX);
        // const startY = Math.floor(fromY);
        const startX = fromX;
        const startY = fromY;

        const dirX = Math.cos(this._dir);
        const dirY = Math.sin(this._dir);

        const stepX = Math.sign(dirX);
        const stepY = Math.sign(dirY);

        const deltaX = Math.abs(1 / dirX);
        const deltaY = Math.abs(1 / dirY);

        let tMaxX = (stepX > 0) ? (startX + 1 - fromX) / dirX : (startX - fromX) / dirX;
        let tMaxY = (stepY > 0) ? (startY + 1 - fromY) / dirY : (startY - fromY) / dirY;

        let currentX = startX;
        let currentY = startY;
        let currentDist = 0;

        let entities = handler.getObjsByInstance(entType);

        while (currentDist <= distance) {
            // Check current tile
            const pos = this._vector2Cache.setxy(currentX / precision, currentY / precision).scale(tileSize);

            for (const ent of entities) {

                if (ent != sender && ent._feetBox.checkPointCollision(pos)) {
                    pos.setxy((currentX / precision) * tileSize, (currentY / precision) * tileSize);

                    collisions.push(pos.clone());

                    if (stopOnFirst) break;
                }
            }

            // Move to next tile
            if (tMaxX < tMaxY) {
                currentX += stepX;
                currentDist = tMaxX;
                tMaxX += deltaX;
            } else {
                currentY += stepY;
                currentDist = tMaxY;
                tMaxY += deltaY;
            }
        }

        return collisions;
    }

    // substepping 0 - 1. 0 is no substepping, 1 is full substepping. 1 is going world pixel by pixel ( not screen pixel)
    getTileCollisionsOld(maxDistance = -1, stopOnFirst = false, subStepping = 0) {

        const stepMultiplier = this.percToGridSize(subStepping, 16, 1);
        const collisions = [];

        // Calculate distance
        const distance = (this._to && maxDistance == -1) ? this._from.getDist(this._to) : (this._x != null && this._y != null && maxDistance == -1) ? this._from.getDistXY(this._x, this._y) : maxDistance;

        if (distance == -1) {
            console.log("No distance set");
            return [];
        }

        // Convert to grid coordinates
        const startX = Math.floor(this._from.x);
        const startY = Math.floor(this._from.y);

        // Calculate direction vector
        const dirX = Math.cos(this._dir);
        const dirY = Math.sin(this._dir);

        // Calculate step size and initial error
        const stepX = Math.sign(dirX);
        const stepY = Math.sign(dirY);

        const deltaX = Math.abs(1 / dirX);
        const deltaY = Math.abs(1 / dirY);

        let tMaxX = (stepX > 0) ? (startX + 1 - this._from.x) / dirX : (startX - this._from.x) / dirX;
        let tMaxY = (stepY > 0) ? (startY + 1 - this._from.y) / dirY : (startY - this._from.y) / dirY;

        let currentX = startX;
        let currentY = startY;
        let currentDist = 0;

        while (currentDist <= distance) {
            // Check current tile
            const pos = this._vector2Cache.setxy(currentX, currentY);
            if (!MapHandler.getIsWalkable(pos)) {
                pos.setxy(currentX, currentY);

                collisions.push(pos.clone());
                if (stopOnFirst) break;
            }

            // Move to next tile
            if (tMaxX < tMaxY) {
                currentX += stepX * stepMultiplier;
                currentDist = tMaxX;
                tMaxX += deltaX * stepMultiplier;
            } else {
                currentY += stepY * stepMultiplier;
                currentDist = tMaxY;
                tMaxY += deltaY * stepMultiplier;
            }
        }

        return collisions;
    }

    percToGridSize(perc, max, min) {
        return (1 - perc) * (max - min) + min;
    }
}
