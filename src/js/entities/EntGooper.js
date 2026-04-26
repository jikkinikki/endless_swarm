import Ent from "./Ent";
import Handler from "../engine/handlers/Handler";
import WeapBoomo from "../combat/weapons/WeapBoomo";
import WeapStabber from "../combat/weapons/WeapStabber";
import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";

import moveAnim from "./../../textures/enemies/b1.png";
import PickupXP from "../pickups/PickupXP";
import Monster from "./Monster";

export default class EntGooper extends Monster {

    constructor(position) {
        super("gooper", position);

        this.weapons = [

            new WeapStabber().pickup(this)
        ];

        this._anim = new Animation(moveAnim, 4, Renderer.speed, 8).setFramesOffset(4).setShadow(9, 11);

        this._baseSpeed = 40;


        // this.xpDrop = Math.floor(Math.random() * 3);
        this.setDropRate(PickupXP, Math.floor(Math.random() * 3));
    }

    tick() {

        super.tick();
        
        // const playerDir = this.position.getDir(Handler.getPlayers()[0].position);
        // this.position.moveInDir(playerDir, 1);
        // this.anim.faceDirection(playerDir);

        // this.tick();
    }
}