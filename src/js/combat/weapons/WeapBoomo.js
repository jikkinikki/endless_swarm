import Handler from "../../engine/handlers/Handler";
import Projectile from "./Projectile";
import Weapon from "./Weapon";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Animation from "../../engine/Animation/Animation";

import boomorang from "./../../../textures/weapons/boomorang.png";

export default class WeapBoomo extends Weapon {

    constructor() {
        super("boom boomerang");

        this.weapAnim = new Animation(boomorang, 1, 1, 1);
    }

    tick() {

        if (!this.tryToFire())
            return;

        const enemy = Handler.getClosest(this.owner, Handler.getEnemies(this.owner))
        // Fix coordinate system issue by manually calculating direction
        let dirToEnemy;
        if (enemy) {
            // const dx = enemy.position._x - this.owner.position._x;
            // const dy = enemy.position._y - this.owner.position._y;
            // dirToEnemy = Math.atan2(dy, dx);
            dirToEnemy = this.owner.position.getDir(enemy.position);
        } else 
            dirToEnemy = Math.random() * Math.PI * 2;
        
        const proj = new Projectile(this.owner.position.clone(), enemy ? this._statData.lifeTime * 2 : 0, dirToEnemy, this).setTickFunc(

            /**
             * @param {Projectile} proj 
             */
            proj => {

                const timeProgress = (TimeHandler.totGameTime - proj.spawnTime) / this._statData.lifeTime;
                // const offset = timeProgress < 0.5 ? 0 : Math.PI;
                // const finalDir = proj.dir + offset;

                if(timeProgress > 0.48){

                    proj.dir = proj.position.getDir(this.owner.position);

                    if(proj.position.getDist(this.owner.position) < 10){

                        proj.killSelf();
                    }
                }

                proj.moveInDir(proj.dir, this._statData.moveSpeed);
            }
        );
        proj.anim = new Animation(boomorang, 1, 1).setSpin(10, 1);

        Handler.addObj(proj);
    }
}