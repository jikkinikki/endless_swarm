import Handler from "../../engine/handlers/Handler";
import Projectile from "./Projectile";
import Weapon from "./Weapon";

import fireBall from "./../../../textures/fire_ball.png";
import Animation from "../../engine/Animation/Animation";
import Renderer from "../../engine/handlers/Renderer";
import TimeHandler from "../../engine/handlers/TimeHandler";

export default class WeapBaam extends Weapon {

    constructor() {

        super("boom boom bomb", "Shoot out grenades around you that explodes.");
    }

    /**
     * @returns {Projectile}
     */
    getExplodeProj() {

        const proj = new Projectile(this.owner.position.clone(), 0.01 * 1000, 0, this)
            .setTickFunc(
                /**
                 * @param {Projectile} proj 
                 */
                proj => {

                    proj.position._x += Math.cos(proj.dir) * 500 * TimeHandler.deltaTimeSecs;
                    proj.position._y += Math.sin(proj.dir) * 500 * TimeHandler.deltaTimeSecs;
                }
            );

        proj.anim = new Animation(fireBall, 1, Renderer.speed);

        return proj;
    }

    getProj() {

        const proj = new Projectile(this.owner.position.clone(), this._statData.lifeTime, 0, this).setTickFunc(

            /**
             * @param {Projectile} proj 
             */
            proj => {

                const percTimeLived = (TimeHandler.totGameTime - proj.spawnTime) / this._statData.lifeTime;

                if (percTimeLived < 1) {

                    proj.moveInDir(proj.dir, this._statData.moveSpeed);
                }
                else if (percTimeLived >= 1) {

                    for (let i = 0; i < 5; i++) {

                        let newProj = this.getExplodeProj();
                        newProj.position = proj.position.clone();
                        Handler.addObj(newProj);
                    }

                    if(proj.detonationsLeft > 1) {
                        proj.detonationsLeft -= 1;
                        proj.spawnTime = TimeHandler.totGameTime;
                        // proj.setLifeTime(this.lifeTime);
                        // proj.setTickFunc(proj.tickFunc);
                    }
                }
            }
        )

        proj.checkCollision = () => {};

        return proj;
    }

    tick() {

        if (this.tryToFire()) {

            const rotOffest = Math.random() * Math.PI * 2;

            for (let i = 0; i < this._statData.projCount; i++) {

                const proj = this.getProj();
                proj.detonationsLeft = this.detonations;
                proj.dir = Math.PI * 2 / this._statData.projCount * i + rotOffest;
                Handler.addObj(proj);
            }
        }
    }
}