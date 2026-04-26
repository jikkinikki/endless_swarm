import Handler from "../../engine/handlers/Handler";
import Projectile from "./Projectile";
import Weapon from "./Weapon";

import fireBall from "./../../../textures/fire_ball.png";
import Animation from "../../engine/Animation/Animation";
import Renderer from "../../engine/handlers/Renderer";
import TimeHandler from "../../engine/handlers/TimeHandler";

export default class WeapEnhialator extends Weapon {

    constructor() {

        super("Clean House", "Sends out devastating chockwave.");

        // this.setLevel(0);
    }

    /**
     * @returns 
     */
    getExplodeProj() {

        const proj = new Projectile(this.owner.position.clone(), 0.01 * 1000, 0, this)
            .setTickFunc(
                /**
                 * @param {Projectile} proj 
                 */
                proj => {

                    proj.position._x += Math.cos(proj.dir) * 10;
                    proj.position._y += Math.sin(proj.dir) * 10;
                }
            );

        proj.render = ctx => {

            this.exploAnim.render(ctx, proj.position);
        }

        return proj;
    }

    getProj() {

        const proj = new Projectile(this.owner.position.clone(), this._statData.lifeTime, 0, this).setTickFunc(

            /**
             * @param {Projectile} proj 
             */
            proj => {

                const timeLived = (TimeHandler.totGameTime - proj.spawnTime) / this._statData.lifeTime;

                if (timeLived < 1) {

                    // console.log(this._statData.moveSpeed);
                    
                    proj.moveInDir(proj.dir, this._statData.moveSpeed);
                }
            }
        );

        proj.anim = new Animation(fireBall, 1, Renderer.speed);

        // proj.render = ctx => {

        //     this.exploAnim.render(ctx, proj.position);
        // }

        return proj;
    }

    /**
     */
    tick() {

        if (this.tryToFire()) {

            const projsCount = 100;
            // console.log(this.reloadTime);
            for (let i = 0; i < projsCount; i++) {

                const proj = this.getProj();
                proj.dir = Math.PI * 2 / projsCount * i
                Handler.addObj(proj);
            }
            // this._lastReload = TimeHandler.totGameTime;
        }
    }
}