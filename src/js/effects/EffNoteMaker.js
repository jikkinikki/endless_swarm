import Handler from "../engine/handlers/Handler";
import ProjNote from "../combat/projectiles/ProjNote";
import Random from "../engine/Tools/Random";
import Effect from "./Effect";

export default class EffNoteMaker extends Effect {

    constructor(duration, amplifier, caster) {

        super(duration, amplifier);

        this.setCaster(caster);

        this._colors = ["green", "blue", "red"];
    }

    onDeath(){

        const note = this.getNote(Random.fromArray(this._colors));

        // Handler.addObj(note, ["projectiles", "notes"]);
        Handler.addObj(note, ["notes"]);
    }

    resetTarget(){}

    getNote(color){

        return new ProjNote(this._target.position.clone(), this._caster, 5000, this.calcWeight(), color);
    }

    calcWeight() {

        return this._amplifier;
    }
}