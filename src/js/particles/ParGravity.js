import TimeHandler from "../engine/handlers/TimeHandler";
import Particle from "./Particle";

export default class ParGravity extends Particle {

    constructor(position, lifeTime, dir) {

        super(position, lifeTime, dir);
    }

    tick() {

        super.tick();

        if (this._lifeTime > 0) {

            this._position._y += this.calcGravity() * TimeHandler.deltaTimeSecs;
        }
    }

    calcGravity() {

        return (TimeHandler._totGameTime - this._spawnTime) * 0.6;
    }
}