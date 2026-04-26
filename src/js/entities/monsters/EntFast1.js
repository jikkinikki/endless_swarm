import WeapStabber from "src/js/combat/weapons/WeapStabber";
import Animation from "src/js/engine/Animation/Animation";

import moveAnim from "./../../../textures/tiles.png";
import Vector2 from "src/js/engine/Tools/Vector2";
import Monster from "../Monster";

export default class EntFast1 extends Monster {

    constructor(position){
        super("fast1", position);

        this.addWeapon(new WeapStabber(this));
        this._anim = new Animation(moveAnim, 4, 10, 1).setStartOffset(new Vector2(27, 19).scale(16)).setSize(16, 16)
    }
}