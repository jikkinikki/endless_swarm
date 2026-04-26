import Effect from "./Effect";

export default class EffSlowness extends Effect {

    /** Multiplies targets base speed with the amplifier
     * 
     * @param {Number} duration 
     * @param {Number} amplifier 
     */
    constructor(duration, amplifier) {

        super(duration, amplifier);

        if(amplifier >= 1)
            console.log("Amplifier must be less than 1, Use speed instead of slowness maybe?");
    }

    tick() {

        super.tick();

        if (this._target) {
            
            const newSpeed = this._target._baseSpeed * this.calcWeight();

            if (this._target._speed > newSpeed){

                this._target._speed = newSpeed;
            }
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