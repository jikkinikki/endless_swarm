import MapHandler from "../map/MapHandler";
import AIMover from "./AIMover";
import Handler from "../engine/handlers/Handler";
import TimeHandler from "../engine/handlers/TimeHandler";
import Monster from "../entities/Monster";
import ChunkingHandler from "../engine/handlers/ChunkingHandler";

export default class AIMMonster extends AIMover {

    constructor(owner) {

        super(owner);

        this.addMoveState("astar2", this.astarMove2, () => { }, () => {
            return null;
        });

        this.addMoveState("astar", this.astarMove, () => { }, () => {

            const target = Handler.getPlayers()[0];

            this._ray.posToPos(this._owner.getFeetPos(), target.getFeetPos());

            if (TimeHandler.totGameTime - this._lastMoveTypeUpd > 1000)
                if (this._ray.getTileCollisions(-1, true, MapHandler.getTileSize(), MapHandler.getTileSize() / 4).length == 0)
                    this.setMoveState("direct");

            return null;
        }, true);

        this.addMoveState("direct", this.directMove, () => {

            this.setMoveState("astar");
        });

        this.addMoveState("rayPushEnts", this.rayPushEntsMove, () => {

            this.setMoveState("astar");
        });

        this.setMoveState("astar2");

    }

    tick() {

        super.tick();
    }


    astarMove(failFunc) {

        let targetPos = MapHandler.getPosTowardsPlayer(this._owner.getFeetPos());
        // return targetPos;

        if (!targetPos)
            return null;

        let dir = this._owner.getFeetPos().getDir(targetPos);

        return this.validateMove(dir, failFunc, this.predictFeetCenterCollision);
        // if()
    }

    astarMove2(failFunc) {

        let targetPos = ChunkingHandler.getPosTowardsPlayer(this._owner.getFeetPos());

        if(!targetPos)
            return null;

        let dir = this._owner.getFeetPos().getDir(targetPos);

        return this.validateMove(dir, failFunc, () => {return false} );
    }
}