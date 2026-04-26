import Ent from "../entities/Ent";
import Handler from "../engine/handlers/Handler";
import MapHandler from "../map/MapHandler";
import TimeHandler from "../engine/handlers/TimeHandler";
import Ray from "../engine/Tools/Ray";
import Debug from "../engine/debug/Debug";
import Renderer from "../engine/handlers/Renderer";
import Monster from "../entities/Monster";

export default class AIMover {

    constructor(owner) {

        /** @type {Ent} */
        this._owner = owner;

        this._ray = new Ray();

        this._moveStates = {}

        this._nextPosDebug;

        this.addMoveState("rayPush", this.rayPushMove, () => { });
        this.addMoveState("rayPushEnts", this.rayPushEntsMove, () => { });
        this.addMoveState("direct", this.directMove, () => { }, () => { }, true);
        this.addMoveState("idle", () => { }, () => { });

        // this.setMoveState("rayPush");
        this.setMoveState("direct");

        this._targetPosIntervalled = Handler.getPlayers()[0].getFeetPos().clone();
        this._targetPosIntervalledTime = 0;

        this._lastPathUpdTime = 0;
        this._lastPathDir = 0;

        this._lastMoveTypeUpd = 0;
    }

    addMoveState(name, func, failFunc, tickFunc = () => { }, forceMove = false) {
        this._moveStates[name] = {

            "func": func,
            "failFunc": failFunc,
            "tickFunc": tickFunc,
            "forceMove": forceMove
        };
    }

    setMoveState(name) {

        if (this._moveStates[name]) {

            this.moveState = name;
            this._lastMoveTypeUpd = TimeHandler.totGameTime;

        } else {

            console.warn("Move state " + name + " not found.");
        }
    }

    tick() {

        let funcs = this._moveStates[this.moveState];
        let dir = funcs["func"].call(this, funcs["failFunc"]);

        funcs["tickFunc"].call(this);

        if (dir != null) {

            this._nextPosDebug = this._owner.getFeetPos().clone().moveInDir(dir, this._owner.speed * TimeHandler.deltaTimeSecs);
            this._owner.moveInDir(dir, this._owner.speed * TimeHandler.deltaTimeSecs, funcs["forceMove"]);
            this._owner.anim.faceDirection(dir);
        }

        this.updateAnimator(dir);
    }

    updateAnimator(dir) {

        if (this._owner.animator) {

            if (dir != null) {

                this._owner.animator.loadAnim("move");
            }
            else {

                this._owner.animator.loadAnim("idle");
            }
        }
    }

    getTargetPosIntervalled() {

        if (TimeHandler.totGameTime - this._targetPosIntervalledTime > 1000) {

            this._targetPosIntervalled = Handler.getPlayers()[0].getFeetPos().clone();
            this._targetPosIntervalledTime = TimeHandler.totGameTime;
        }

        return this._targetPosIntervalled;
    }

    rayPushEntsMove(failFunc) {

        let target = this.getTargetPosIntervalled();

        let deltaX = (target.x - this._owner.getFeetPos().x) * .015;
        let deltaY = (target.y - this._owner.getFeetPos().y) * .015;

        // deltaX = 0;
        // deltaY = 0;

        let targetDist = target.getDist(this._owner.getFeetPos());
        let tiles = 2;
        let maxRayDist = tiles * MapHandler.getTileSize() < targetDist ? tiles * MapHandler.getTileSize() : targetDist;

        let BestDist = targetDist;
        let BestDir = 0;

        for (let i = 0.01; i < Math.PI * 2; i += Math.PI / 16) {

            this._ray.posToDir(this._owner.getFeetPos(), i);

            let collisions = this._ray.getEntCollisions(maxRayDist, true, 1, this._owner, Monster);
            // console.log(collisions);

            let dist;
            let collision;

            if (collisions.length > 0) {

                dist = this._owner.getFeetPos().getDist(collisions[0]);
                collision = collisions[0];

                continue;
            }
            else {

                dist = maxRayDist;
                collision = this._owner.getFeetPos().clone().moveInDir(i, maxRayDist);
            }

            // deltaX -= Math.cos(i) * Math.pow(1 - (dist / maxRayDist), 2) * 2;
            // deltaY -= Math.sin(i) * Math.pow(1 - (dist / maxRayDist), 2) * 2;

            let distToTarget = target.getDist(collision);

            //Move this down later. Just for debug
            if (this.validateMove(i, () => { }) == null) {

                continue;
            }

            if (distToTarget < BestDist && this.validateMove(i, () => { }) != null) {

                BestDist = distToTarget;
                BestDir = i;
            }

            // ---------------------------------------------

            Debug.debugCtx.beginPath();

            let from = Renderer.worldPosToDrawPos(this._owner.getFeetPos());
            let to = Renderer.worldPosToDrawPos(collision);

            let t = Math.pow(1 - (dist / maxRayDist), 2) * 10;
            let thickness = t > 1 ? t : 1;

            Debug.debugCtx.lineWidth = thickness;
            Debug.debugCtx.moveTo(from.x, from.y);
            Debug.debugCtx.lineTo(to.x, to.y);
            Debug.debugCtx.stroke();
        }


        let sumDir = BestDir;
        this._lastPathDir = BestDir;

        return this.validateMove(sumDir, failFunc);
    }

    rayPushMove(failFunc) {

        // if (TimeHandler.totGameTime - this._lastPathUpdTime < 4000) {

        //     return this.validateMove(this._lastPathDir, failFunc);

        // }
        // this._lastPathUpdTime = TimeHandler.totGameTime;

        let target = this.getTargetPosIntervalled();

        let deltaX = (target.x - this._owner.getFeetPos().x) * .015;
        let deltaY = (target.y - this._owner.getFeetPos().y) * .015;

        // deltaX = 0;
        // deltaY = 0;

        let targetDist = target.getDist(this._owner.getFeetPos());
        let tiles = 6;
        let maxRayDist = tiles * MapHandler.getTileSize() < targetDist ? tiles * MapHandler.getTileSize() : targetDist;

        let BestDist = targetDist;
        let BestDir = 0;

        for (let i = 0.01; i < Math.PI * 2; i += Math.PI / 16) {

            this._ray.posToDir(this._owner.getFeetPos(), i);

            let collisions = this._ray.getTileCollisions(maxRayDist, true, MapHandler.getTileSize(), MapHandler.getTileSize());

            let dist;
            let collision;

            if (collisions.length > 0) {

                dist = this._owner.getFeetPos().getDist(collisions[0]);
                collision = collisions[0];

                continue;
            }
            else {

                dist = maxRayDist;
                collision = this._owner.getFeetPos().clone().moveInDir(i, maxRayDist);
            }

            // deltaX -= Math.cos(i) * Math.pow(1 - (dist / maxRayDist), 2) * 2;
            // deltaY -= Math.sin(i) * Math.pow(1 - (dist / maxRayDist), 2) * 2;

            let distToTarget = target.getDist(collision);

            //Move this down later. Just for debug
            if (this.validateMove(i, () => { }) == null) {

                continue;
            }

            if (distToTarget < BestDist && this.validateMove(i, () => { }) != null) {

                BestDist = distToTarget;
                BestDir = i;
            }

            // ---------------------------------------------

            Debug.debugCtx.beginPath();

            let from = Renderer.worldPosToDrawPos(this._owner.getFeetPos());
            let to = Renderer.worldPosToDrawPos(collision);

            let t = Math.pow(1 - (dist / maxRayDist), 2) * 10;
            let thickness = t > 1 ? t : 1;

            Debug.debugCtx.lineWidth = thickness;
            Debug.debugCtx.moveTo(from.x, from.y);
            Debug.debugCtx.lineTo(to.x, to.y);
            Debug.debugCtx.stroke();
        }


        let sumDir = BestDir;
        this._lastPathDir = BestDir;

        return this.validateMove(sumDir, failFunc);
    }

    rayPushMove2(failFunc) {

        let target = Handler.getPlayers()[0];

        let deltaX = (target.getFeetPos().x - this._owner.getFeetPos().x) * .015;
        let deltaY = (target.getFeetPos().y - this._owner.getFeetPos().y) * .015;

        // deltaX = 0;
        // deltaY = 0;

        let targetDist = target.getFeetPos().getDist(this._owner.getFeetPos());
        let tiles = 6;
        let maxRayDist = tiles * MapHandler.getTileSize() < targetDist ? tiles * MapHandler.getTileSize() : targetDist;

        for (let i = 0; i < Math.PI * 2; i += Math.PI / 16) {

            this._ray.posToDir(this._owner.getFeetPos(), i);

            let collisions = this._ray.getTileCollisions(maxRayDist, true);

            let dist;
            let collision;

            if (collisions.length > 0) {

                dist = this._owner.getFeetPos().getDist(collisions[0]);
                collision = collisions[0];
            }
            else {

                dist = maxRayDist;
                collision = this._owner.getFeetPos().clone().moveInDir(i, maxRayDist);
            }

            deltaX -= Math.cos(i) * Math.pow(1 - (dist / maxRayDist), 2) * 2;
            deltaY -= Math.sin(i) * Math.pow(1 - (dist / maxRayDist), 2) * 2;

            // ---------------------------------------------

            Debug.debugCtx.beginPath();

            let from = Renderer.worldPosToDrawPos(this._owner.getFeetPos());
            let to = Renderer.worldPosToDrawPos(collision);

            let t = Math.pow(1 - (dist / maxRayDist), 2) * 10;
            let thickness = t > 1 ? t : 1;

            Debug.debugCtx.lineWidth = thickness;
            Debug.debugCtx.moveTo(from.x, from.y);
            Debug.debugCtx.lineTo(to.x, to.y);
            Debug.debugCtx.stroke();
        }


        let sumDir = Math.atan2(deltaY, deltaX);

        return this.validateMove(sumDir, failFunc);
    }

    directMove(failFunc) {

        // const playerDir = this.position.getDir(Handler.getPlayers()[0].position);
        const target = Handler.getClosest(this._owner, Handler.getEnemies(this._owner));

        if (!target) return null;

        const moveDir = this._owner.getFeetPos().getDir(target.getFeetPos());

        return this.validateMove(moveDir, failFunc);
    }

    /**
     * 
     * @param {Number} moveDir 
     * @param {Function} failFunc 
     * @param {Function} validateFunc 
     * @returns {Number} moveDir or null if failed
     */
    validateMove(moveDir, failFunc, validateFunc) {

        validateFunc = validateFunc ? validateFunc.bind(this) : this.predictFeetBoxCollision;

        if (!validateFunc.call(this, moveDir)) {

            return moveDir;

        } else {

            failFunc.call(this);
            return null;
        }
    }

    predictFeetBoxCollision(dir) {

        // let pos = this._owner.getFeetPos().clone().moveInDir(dir, this._owner.speed * TimeHandler.deltaTimeSecs * 16);

        // return !MapHandler.getIsWalkable(pos)

        return !this._owner.validateMove(dir, this._owner.speed * TimeHandler.deltaTimeSecs * 16);
    }

    predictFeetCenterCollision(dir) {

        let pos = this._owner.getFeetPos().clone().moveInDir(dir, this._owner.speed * TimeHandler.deltaTimeSecs * 16);

        return !MapHandler.getIsWalkable(pos)
    }
}