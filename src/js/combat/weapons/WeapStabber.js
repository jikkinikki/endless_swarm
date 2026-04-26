import Vector2 from "src/js/engine/Tools/Vector2";
import Handler from "../../engine/handlers/Handler";
import Projectile from "./Projectile";
import Weapon from "./Weapon";

export default class WeapStabber extends Weapon {

    constructor(owner) {
        super("boom boom bomb", owner);

        this._lastReload = -this._statData.cooldown;
        this._statData._baseLifeTime = 100 * 1000000;

        this.proj = null;
    }

    tick() {

        if (this.proj == null)
            this.newProj();

        const enemies = Handler.getEnemies(this.owner);

        for (const enemy of enemies) 
            if (this.owner.getFeetBox().checkHitboxCollision(enemy.getFeetBox()))
                enemy.deltaHp(-this._statData.phDmg);

        // this.proj.position.setxy(this.owner.getFeetPos().x, this.owner.getFeetPos().y);
    }

    newProj() {

        // const proj = new Projectile(this.owner.position.clone(), this._statData.lifeTime, 1, this).setTickFunc(
        const proj = new Projectile(new Vector2(-1000, -1000), this._statData.lifeTime, 1, this).setTickFunc(

            /**
             * @param {Projectile} proj 
             */
            proj => {


            }
        )

        proj.render = ctx => {}

        this.proj = proj;
        Handler.addObj(proj);
    }
}