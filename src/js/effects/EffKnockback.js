import MapHandler from "../map/MapHandler";
import TimeHandler from "../engine/handlers/TimeHandler";
import Effect from "./Effect";

export default class EffKnockback extends Effect{

    constructor(duration, amplifier, dir) {

        super(duration, amplifier);

        if(typeof dir == "object")
            console.log("No I said direction, not Vector2!");
            

        this._dir = dir;
    }

    tick(){

        super.tick();

        if(this._target) {

            // const newPos = this._target.position.clone().moveInDir(this._dir, this.calcWeight() * TimeHandler.deltaTime);
       
            // if(MapHandler.getIsWalkable)
            this._target.moveInDir(this._dir, this.calcWeight() * TimeHandler.deltaTime);
        }
    }

    calcWeight() {

        return this._amplifier;
    }

    resetTarget(){
        
    }
}