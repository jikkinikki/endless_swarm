import Weapon from "./Weapon";
import Animation from "src/js/engine/Animation/Animation";
import SDWeapon from "src/js/statData/SDWeapon";

import anim from "src/textures/tiles.png";

import weapon_data from "src/json_data/weapon_data.json";
import Projectile from "./Projectile";
import { Handler } from "src/js/imports";
import Vector2 from "src/js/engine/Tools/Vector2";

export default class WeapCircleShooter extends Weapon {

    constructor(rotationSpeed = 0, projLines = 10, intensity = 1) {

        super("circle shooter", "Shoots projectiles in a circle");

        this.angleOffset = 0;
        this.rotationSpeed = rotationSpeed;
        this.projLines = projLines;
        this.intensity = intensity;
    }

    tick() {

        // console.log(this.timeUntilReady());

        this._statData._baseCooldown = 300 * this.intensity;
        
        if (this.tryToFire()) {
            
            this.angleOffset += this.rotationSpeed;

            for (let i = 0; i < this.projLines; i++) {

                const dir = i * Math.PI * 2 / this.projLines + this.angleOffset;
                const proj = new Projectile(this.owner.position.clone(), 7000, dir, this);

                proj.setTickFunc(proj => {

                    // console.log("tick");

                    // const target = Handler.getEnemies(this.owner)[0];
                    // const dir = this.owner.position.getDir(target.position);
                    proj.moveInDir(proj.dir, this._statData.moveSpeed * 20);
                    // proj.anim.setRotationOffset(dir + Math.PI / 2);
                });

                proj.anim = new Animation(anim, 1, 1, 1).setStartOffset(new Vector2(18 * 16, 8)).setSize(16, 16);
                proj.anim.setRotationOffset(dir + Math.PI / 2);

                Handler.addObj(proj);
            }

        }
    }
}