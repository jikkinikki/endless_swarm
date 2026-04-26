import EffSlowness from "../../effects/EffSlowness";
import EffLifeDrain from "../../effects/EffLifeDrain";
import Ent from "../../entities/Ent";
import Handler from "../../engine/handlers/Handler";
import Renderer from "../../engine/handlers/Renderer";
import Weapon from "../weapons/Weapon";
import Beam from "./Beam";
import staffAnim from "./../../../textures/weapons/staff.png";
import Animation from "../../engine/Animation/Animation";
import Vector2 from "../../engine/Tools/Vector2";
import TimeHandler from "../../engine/handlers/TimeHandler";

export default class WeapLifeDrain extends Weapon {

    constructor(owner) {

        super("life drain", "drains the life of enemies");
        this.pickup(owner);

        this._baseLifeTime = this._statData.lifeTime;

        this._lifeTime = this._statData.lifeTime;
        
        this.beams = [];

        this._anim = new Animation(staffAnim, 1, Renderer.speed * 2, 1);

        this._staffShowExtraTime = 250;
        this._lastActiveStartTime = -this._baseLifeTime - this._staffShowExtraTime;
    }

    tick() {


    }

    render(ctx) {

        if (this._lastActiveStartTime + this._baseLifeTime + this._staffShowExtraTime > TimeHandler.totGameTime) {

            const staffShowTimePerc = this.getStaffShowTimePerc();

            // ctx.save();
            // ctx.globalAlpha = staffShowTimePerc * 10;

            // this._anim.render(ctx, this.owner.position.clone().add(new Vector2(-20, -10)));

            // ctx.restore();
        }
    }

    getStaffShowTimePerc() {
        return -(this._lastActiveStartTime - TimeHandler.totGameTime) / (this._baseLifeTime + this._staffShowExtraTime);
    }

    /**
     * Use for activatable stuff
     */
    fire() {

        /** @type {Ent[]} */
        const nearbyEnemies = Handler.getClose(this.owner, Handler.getEnemies(this.owner), 5 + 15); // take extra for later loss

        if (nearbyEnemies.length == 0)
            return;

        if(!this.tryToFire())
            return;

        // this.targetEnemies = [];
        // this.clearBeams();
        // this._lastReload = TimeHandler.totGameTime;

        this._lastActiveStartTime = TimeHandler.totGameTime;
        let lifeTime = this._statData._baseLifeTime;

        let matches = 0;
        for (const enemy of nearbyEnemies) {

            if (matches >= this._statData.projCount)
                break;

            if (enemy.position.getDist(this.owner.position) < 60 * 16 / Renderer.getZoom()) {

                enemy.applyEffect(new EffSlowness(lifeTime, .1));
                enemy.applyEffect(new EffLifeDrain(lifeTime, this._statData._basePhDmg, this._statData._baseHealing).setCaster(this.owner));
                // this.sendBeam(enemy);

            }

            this.owner.applyEffect(new EffSlowness(lifeTime, .5))

            matches++;
        }
    }

    sendBeam(target) {

        const beam = new Beam(this.owner, target, this._lifeTime);

        this.beams.push(beam);

        Handler.addObj(beam, ["projectiles"]);
    }

    clearBeams() {

        for (const beam of this.beams) {
            Handler.removeObj(beam, ["projectiles"]);
        }

        this.beams = [];
    }
}