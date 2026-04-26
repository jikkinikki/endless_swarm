import TimeHandler from "src/js/engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";
import Animation from "src/js/engine/Animation/Animation";

import boomorang from "./../../../textures/weapons/boomorang.png";
import anim from "src/textures/tiles.png";

import Projectile from "../weapons/Projectile";
import { Handler } from "src/js/imports";
import Vector2 from "src/js/engine/Tools/Vector2";

export default class Smasher extends Weapon{

    constructor(intensity = 1, randRadius = 1){

        super("smasher", "Smashes the ground");

        this.intensity = intensity;
        this.randRadius = randRadius;
        this._statData._baseCooldown /= this.intensity;
    }

    tick(){

        if(this.tryToFire()){

            let randomPlayer = Handler.getEnemies(this.owner)[0];

            let randX = Math.random() * this.randRadius * 2 - this.randRadius;
            // let randY = Math.random() * this.randRadius * 2 - this.randRadius;
            let randY = 0;
            let projPos = randomPlayer.position.clone().add(new Vector2(0, -40)).add(new Vector2(randX, randY));

            let proj = new Projectile(projPos, this._statData.lifeTime, Math.PI / 2, this);

            proj.setTickFunc(this.projTick);
            // proj.anim = new Animation(boomorang, 1, 1, 1);
            proj.anim = new Animation(anim, 1, 1, 1).setStartOffset(new Vector2(18 * 16, 8)).setSize(16, 16);


            Handler.addObj(proj);
        }
    }

    /**
     * 
     * @param {Projectile} proj 
     */
    projTick(proj){

        //TODO use correct data if possible
        let speed = 300;
        let initDelay = 200;

        if(TimeHandler._totGameTime - proj.spawnTime > initDelay){

            proj.moveInDir(proj.dir, speed);
            proj.anim.setRotationOffset(Math.PI);
        }
        else{

            proj.anim.deltaRotation(Math.PI / initDelay * 16.2);
        }

    }
}