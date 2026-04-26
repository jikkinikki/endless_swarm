import WeapStabber from "../combat/weapons/WeapStabber";
import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";

import moveAnim from "./../../textures/enemies/e1.png";
import Monster from "./Monster";

// import hpAnim from "./../../textures/hp.png"

export default class EntDummy extends Monster {

    constructor(position) {
        super("dummy", position);

        this.weapons = [

            // new WeapBoomo(this)
            new WeapStabber(this).pickup(this)
        ];

        // this._anim = new Animation(hpAnim, 4, Renderer.speed);
        this._anim = new Animation(moveAnim, 4, Renderer.speed, 8).setFramesOffset(4).setShadow(5, 5);
    }
}