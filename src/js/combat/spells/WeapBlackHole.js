import Handler from "../../engine/handlers/Handler";
import ProjBlackHole from "../projectiles/ProjBlackHole";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";

export default class WeapBlackHole extends Weapon {
    constructor(owner) {
        super("black hole", "Spawns black holes around you that sucks in enemies")

        this.pickup(owner);
    }

    tick() {

    }

    fire() {

        if (!this.readyToFire())
            return;

        this._lastReload = TimeHandler.totGameTime;

        for (let i = 0; i < this._statData.projCount; i++) {

            const angle = (i / this._statData.projCount) * Math.PI * 2;
            const proj = new ProjBlackHole(this.owner.position.clone().moveInDir(angle, 150), this._statData.lifeTime, this);

            Handler.addObj(proj, ["projectiles"]);
        }
    }
}