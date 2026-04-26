import MapHandler from "../map/MapHandler";
import AIMover from "./AIMover";
import TimeHandler from "../engine/handlers/TimeHandler";
import ChunkingHandler from "../engine/handlers/ChunkingHandler";

export default class AIMDino extends AIMover {

    constructor(owner) {

        super(owner);

        this.addMoveState("followPlayer", this.followPlayer, () => {});
    
        this.setMoveState("followPlayer");
    }

    tick() {

        super.tick();
    
        if(this._owner._owner.position.getDist(this._owner.position) > 100)
            this.moveState = "followPlayer";

        else
            this.moveState = "idle";
    }

    followPlayer(failFunc) {

        const nextPos = ChunkingHandler.getPosTowardsPlayer(this._owner.getFeetPos());
    
        if(nextPos){

            const dir = this._owner.getFeetPos().getDir(nextPos);
            
            return this.validateMove(dir, failFunc);
        }

        return null;
    }
}