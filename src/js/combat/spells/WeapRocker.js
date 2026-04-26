import EffNoteMaker from "../../effects/EffNoteMaker";
import EffRockify from "../../effects/EffRockify";
import Handler from "../../engine/handlers/Handler";
import ProjNote from "../projectiles/ProjNote";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";

export default class WeapRocker extends Weapon {

    constructor(owner) {

        super("Rock solid", "Turns nearby enemies into rocks");

        this.pickup(owner);

        this.reloadTime = 1 * 1000;

        // this._anim = new Animation(staffAnim, 1, Renderer.speed * 2, 1);
        this._lastReload = 0;
    }

    tick() {

        if (!this.readyToFire())
            return;

        this._lastReload = TimeHandler.totGameTime;

        this.applyRockEffect();
    }

    readyToFire() {

        if (this.owner.isEmpowered)
            return TimeHandler.totGameTime - this._lastReload > (this.reloadTime * 0.01);

        return TimeHandler.totGameTime - this._lastReload > this.reloadTime;
    }

    applyRockEffect() {

        /**@type {Ent[]} */
        const enemies = Handler.getClose(this.owner, Handler.getEnemies(this.owner));

        let lim = this.owner.isEmpowered ? 3 : 1;
        let count = 0;

        for (const enemy of enemies) {

            let canGetEffect = true;

            if (enemy.hasEffect(EffRockify))
                canGetEffect = false;

            if (canGetEffect) {

                if (enemy.position.getDist(this.owner.position) < 450)
                    enemy.applyEffect(new EffRockify(10000, 1, this.owner));

                if (count++ > lim)
                    break;
            }
        }
    }
}