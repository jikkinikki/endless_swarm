import Effect from "./Effect";

export default class EffSpeed extends Effect {

    constructor(duration, amplifier) {

        super(duration, amplifier);

        if(amplifier <= 1)
            console.log("Amplifier must be less than 1, Use slowness instead of speed maybe?");
            
    }

    tick() {

        super.tick();

        if (this._target) {
            
            const newSpeed = this._target._baseSpeed * this.calcWeight();
            

            if (this._target._speed < newSpeed)
                this._target._speed = newSpeed;
        }
    }

    calcWeight() {

       return this._amplifier;
    }

    resetTarget() {

        if (this._target) {
            
            this._target._speed = this._target._baseSpeed;
        }
    }
}