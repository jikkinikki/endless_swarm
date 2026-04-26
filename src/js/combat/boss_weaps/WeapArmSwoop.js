import Animation from "src/js/engine/Animation/Animation";
import Projectile from "../weapons/Projectile";
import Weapon from "../weapons/Weapon";

import skeleton_sprites from "src/textures/bosses/skeleton/skeleton_sprite.png";
import { Handler } from "src/js/imports";
import Vector2 from "src/js/engine/Tools/Vector2";
import TimeHandler from "src/js/engine/handlers/TimeHandler";
// import Vector2 from "src/js/engine/Tools/Vector2";

export default class WeapArmSwoop extends Weapon{

    constructor() {

        super("ArmSwoop", "Arms swwoping in on enemy");
    
        this._statData._baseCooldown = 2000;
    }

    tick() {

        if(this.tryToFire()){

            const randomYOffset = Math.random() * 16 * 14;

            const target = Handler.getEnemies(this.owner)[0];

            this.createHandProj(false, target.position.clone().add(new Vector2(-100, 16 * 8 + randomYOffset)), 0);
            this.createHandProj(true, target.position.clone().add(new Vector2(100, 16 * 8 + randomYOffset)), Math.PI);

            for(let i = 0; i < 3; i++){

                this.createBoneProj(target.position.clone().add(new Vector2(-132, 16 * 8 * i - 32 * 6 + randomYOffset)), 0);
                this.createBoneProj(target.position.clone().add(new Vector2(132, 16 * 8 * i - 32 * 6 + randomYOffset)), Math.PI);
            }
            
        }

        // this.owner.position.clone().add(new Vector2(-100, 16 * 3))
    }

    createHandProj(isRightHand, pos, dir){

        let proj = new Projectile(pos, 1100, dir, this);
        
        proj.setTickFunc(this.projTickFunc);
        proj.dir = dir;
        proj.lastSwap = TimeHandler._totGameTime;

        const yStart = isRightHand ? 2*16 : 0;

        proj.anim = new Animation(skeleton_sprites, 1, 1, 1).setSize(16 * 3, 16 * 2).setStartOffset(new Vector2(3*16, yStart));

        Handler.addObj(proj);
    }

    createBoneProj(pos, dir){

        let proj = new Projectile(pos, 1100, dir, this);

        proj.setTickFunc(this.projTickFunc);
        proj.lastSwap = TimeHandler._totGameTime;

        proj.dir = dir;
        proj.anim = new Animation(skeleton_sprites, 1, 1, 1).setSize(16 * 1, 16 * 2).setStartOffset(new Vector2(6*16, 16 * 2));

        Handler.addObj(proj);
    }

    /**
     * 
     * @param {Projectile} proj 
     */
    projTickFunc(proj){

        // console.log(proj.position);
        const speed = 150;
        proj.moveInDir(proj.dir, speed);

        if(TimeHandler._totGameTime - proj.lastSwap > 10 * speed){

            proj.dir = proj.dir === 0 ? Math.PI : 0;
            proj.lastSwap = TimeHandler._totGameTime;
        }

        
    }
}