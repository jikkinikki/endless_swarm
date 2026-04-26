import WeapStabber from "src/js/combat/weapons/WeapStabber";
import Animation from "src/js/engine/Animation/Animation";

import moveAnim from "./../../../textures/tiles.png";
import Vector2 from "src/js/engine/Tools/Vector2";
import Monster from "../Monster";
import Hitbox from "src/js/engine/Tools/Hitbox";
import Renderer from "src/js/engine/handlers/Renderer";

export default class EntTank2 extends Monster {

    constructor(position){
        super("tank2", position);

        this.addWeapon(new WeapStabber(this));
        this._anim = new Animation(moveAnim, 4, Renderer.speed, 4).setStartOffset(new Vector2(9 * 16, 24 * 16)).setSize(32, 32)
        this._feetBox = new Hitbox(new Vector2(-16, 8), new Vector2(32, 16), this);
        this.addComponent(this._feetBox);

    }

    // deltaHp(delta){
    //     super.deltaHp(delta);
    //     console.log(this._statData.hp);
    // }

    // render(ctx){
    //     super.render(ctx);

        // let drawPos = Renderer.worldPosToDrawPos(this.position);
        // ctx.fillStyle = "black";
        // ctx.fillRect(drawPos.x - 16, drawPos.y - 36, 32, 4);
        // ctx.fillStyle = "red";
        // ctx.fillRect(drawPos.x - 16, drawPos.y - 36, 32 * this._statData.hp / this._statData.maxHp, 4);
    // }
}