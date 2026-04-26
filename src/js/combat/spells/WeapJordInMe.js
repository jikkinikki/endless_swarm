import EffKnockback from "../../effects/EffKnockback";
import EffRockify from "../../effects/EffRockify";
import EffSlowness from "../../effects/EffSlowness";
import EffSpeed from "../../effects/EffSpeed";
import Ent from "../../entities/Ent";
import Handler from "../../engine/handlers/Handler";
import Inventory from "../../Inventory";
import ItemRock from "../../items/ItemRock";
import KeyboardInput from "../../engine/inputs/KeyboardInput";
import Ray from "../../engine/Tools/Ray";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";

export default class WeapJordInMe extends Weapon {

    constructor(owner) {

        super("Jord", "Aweken Jord and borrow her strength");

        this.pickup(owner);

        this.reloadTime = 10 * 1000;

        this._lastReload = -this.reloadTime;

        this._empowerDuration = 10000 * 60;
        this._empowerTime = -this._empowerDuration;
        // this._empowerTime = 0;

        /** @type {Ent} */
        this._dashTarget = null;

    }

    isEmpowered() {

        return TimeHandler.totGameTime - this._empowerTime < this._empowerDuration;
    }

    tick() {


        if (this.isEmpowered()) {

            this._lastReload = TimeHandler.totGameTime;
            this.owner.isEmpowered = true;

            if (this._dashTarget != null && this._dashTarget.isDead)
                this._dashTarget = null;

            if (!this._dashTarget) {

                if (KeyboardInput.getKeyIsDown("e"))
                    this.findNearbyRockTarget();
            }
            else {

                this.dashTowardsTarget();

                if (this.targetReached()) {

                    this.attackTarget();
                }
            }
        }
        else
            this.owner.isEmpowered = false;
    }

    targetReached() {

        return this._dashTarget != null && this.owner.position.getDist(this._dashTarget.position) < 50;
    }

    attackTarget() {

        this._dashTarget.deltaHp(-10);
        this.owner.deltaHp(.1)

        this.knockbackNearbyEnemies(100, 100, .1);
    }

    knockbackNearbyEnemies(distLim, duration, strength) {

        const enemies = this.getEnemies(distLim);

        for (const enemy of enemies) {

            if (enemy != this._dashTarget && !enemy.hasEffect(EffRockify))
                enemy.applyEffect(new EffKnockback(duration, strength, this.owner.position.getDir(enemy.position)));
        }
    }

    dashTowardsTarget() {

        const dashDir = this.owner.position.getDir(this._dashTarget.position);

        this.knockbackNearbyEnemies(100, 10, 2);

        if (!this.targetReached())
            this.owner.moveInDir(dashDir, 2 * TimeHandler.deltaTime, false);
    }

    /**
     * 
     * @param {Number} distLim 
     * @returns {Ent[]}
     */
    getEnemies(distLim) {

        return Handler.getClose(this.owner, Handler.getEnemies(this.owner), 1000000, distLim);
    }

    findNearbyRockTarget() {

        // const enemies = Handler.getClose(this.owner, Handler.getEnemies(this.owner), 350);
        const enemies = this.getEnemies(350);

        for (const enemy of enemies) {

            if (enemy.hasEffect(EffRockify) && new Ray().posToPos(this.owner.getFeetPos(), enemy.getFeetPos()).getTileCollisions().length == 0) {

                this._dashTarget = enemy;
                break;
            }
        }
    }

    fire() {

        if (!this.readyToFire())
            return;

        this._empowerTime = TimeHandler.totGameTime;

        this.knockbackNearbyEnemies(200, 50, .7);

        for (const enemy of this.getEnemies(300)) {

            if (!enemy.hasEffect(EffRockify)) {

                enemy.applyEffect(new EffRockify(100000, 1000, this.owner));

                // enemy.applyEffect(new EffSlowness(1000, 1000, this.owner.position.getDir(enemy.position)));
            }
        }
    }
}