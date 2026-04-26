import Handler from "../engine/handlers/Handler";
import ProjHealSeek from "../combat/projectiles/ProjHealSeek";
import TimeHandler from "../engine/handlers/TimeHandler";
import Effect from "./Effect";
import Random from "../engine/Tools/Random";

export default class EffLifeDrain extends Effect {
    constructor(duration, amplifier, healAmount) {

        super(duration, amplifier);
        this._lastApply = -100000;
        this._applyInterval = 200;
        this._IntervalRandomOffset = 50;
        this._healAmount = healAmount;
    }

    tick() {

        super.tick();

        if (this._target) {

            if (TimeHandler.totGameTime - this._lastApply >= this._applyInterval) {
                this._lastApply = TimeHandler.totGameTime + Random.range(-this._IntervalRandomOffset, this._IntervalRandomOffset);
                this._target.deltaHp(-this.calcWeight());

                let proj = new ProjHealSeek(this._target.position.clone(), this._caster, 5000, this.calcHealAmount());

                Handler.addObj(proj, ["projectiles"]);
            }
        }
    }

    calcWeight() {

        // console.log(this._amplifier / this._totDuration * this._applyInterval);
        return this._amplifier / this._totDuration * this._applyInterval;
    }

    calcHealAmount() {
        return this._healAmount / this._totDuration * this._applyInterval;
    }

    resetTarget() {}

}