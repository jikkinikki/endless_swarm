import Handler from "../../engine/handlers/Handler";
import Projectile from "./Projectile";
import Weapon from "./Weapon";

import Renderer from "../../engine/handlers/Renderer";

import boomorang from "./../../../textures/weapons/boomorang.png";
import Animation from "../../engine/Animation/Animation";

export default class WeapBounce extends Weapon {

    constructor() {
        super("Bounce that", "Bounces between enemies.");
    }

    sendProj() {

        const proj = new Projectile(this.owner.position.clone(), this._statData.lifeTime, 0, this).setTickFunc(

            /**
             * @param {Projectile} proj 
             */
            proj => {

                // const offset = (TimeHandler.totGameTime - proj.spawnTime) / this.lifeTime < 0.5 ? 0 : Math.PI;

                if (typeof proj.target != "object" || proj.target.hp <= 0 || proj.position.getDist(proj.target.position) < proj.size) {

                    let enemies = [...Handler.getEnemies(this.owner)];

                    for (let i = enemies.length - 1; i >= 0; i--) {

                        const enemy = enemies[i];

                        if (enemy.isInvurnable)
                            enemies.splice(i, 1);
                    }

                    if (enemies.includes(proj.target))
                        enemies.splice(enemies.indexOf(proj.target), 1);

                    proj.target = Handler.getClosest(this.owner, enemies);
                }

                proj.moveInDir(proj.position.getDir(proj.target.position), this._statData.moveSpeed);
            }
        );
        proj.target = "";
        proj.anim = new Animation(boomorang, 1, Renderer.speed).setSpin(10, 1);

        Handler.addObj(proj);
    }

    tick() {

        if (!this.tryToFire())
            return;

        for (let i = 0; i < this._statData.projCount; i++)
            this.sendProj();
    }
}