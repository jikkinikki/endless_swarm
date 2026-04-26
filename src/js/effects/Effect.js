import Ent from "../entities/Ent";
import TimeHandler from "../engine/handlers/TimeHandler";

export default class Effect {

    constructor(duration, amplifier) {

        this._totDuration = duration;
        this._amplifier = amplifier;
    }

    /**
     * 
     * @param {Ent} caster 
     * @returns 
     */
    setCaster(caster) {

        if (!(caster instanceof Ent)) {
            throw new Error("Effect caster must be an Ent, got " + caster.constructor.name);
        }

        this._caster = caster;
        return this;
    }

    /**
     * 
     * @param {Ent} target 
     */
    apply(target) {

        if (!(target instanceof Ent)) {
            throw new Error("Effect target must be an Ent, got " + target.constructor.name);
        }

        this._target = target;  
        this.durationLeft = this._totDuration;
    }

    tick() {

        if (this._target) {

            if (this.durationLeft > 0)
                this.durationLeft -= TimeHandler._deltaTime;

            else {

                this.resetTarget();
                this._target.removeEffect(this);
                this._target = null;
            }
        }
        else
            console.warn("Effect has no target, cannot tick. Effect: " + this.constructor.name);
    }

    resetTarget() {

        console.warn("Effect has no resetTarget function, cannot reset target. Effect: " + this.constructor.name);
    }

    onDeath(){

        
    }
}