import Handler from "../../engine/handlers/Handler";
import Projectile from "./Projectile";
import Weapon from "./Weapon";

export default class WeapPang extends Weapon {

    constructor(owner) {

        super("pang pang gun", owner);
    
    }

    getTarget(){

        const targets = Handler.getEnemies(this.owner);

        if (targets.length == 0)
            return null;

        return Handler.getClosest(this.owner, targets, this._statData.range)
    }
    
    createProj() {

        const target = this.getTarget();

        if (target == null)
            return null;

        const dir = this.owner.position.getDir(target.position);

        const proj = new Projectile(this.owner.position.clone(), this._statData.lifeTime, dir, this).setTickFunc(

            /**
             * 
             * @param {Projectile} proj 
             */
            proj => {

                proj.position._x += Math.cos(proj.dir) * this._statData.moveSpeed;
                proj.position._y += Math.sin(proj.dir) * this._statData.moveSpeed;
            }
        );

        return proj;
    }

    tick() {

        if (this.readyToFire()) {

            const proj = this.createProj();

            if (proj != null){

                // Handler.addObj(proj);
                this.tryToFire(proj);
            }
        }
    }
}