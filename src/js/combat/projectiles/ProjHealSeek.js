import Handler from "../../engine/handlers/Handler";
import Renderer from "../../engine/handlers/Renderer";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Vector2 from "../../engine/Tools/Vector2";
import Projectile from "../weapons/Projectile";
import heartAnim from "../../../textures/other/heart.png"
import Animation from "../../engine/Animation/Animation";

export default class ProjHealSeek extends Projectile {

    constructor(position, target, lifeTime, healAmount) {

        super(position, lifeTime, 0, null);

        this._healAmount = healAmount;
        this._target = target;
        this._speed = 150;

        this.tickFunc = () => { };
        this._anim = new Animation(heartAnim, 1, 1, 1);

    }

    checkCollision() {

        if (this.position.getDist(this._target.position) < this.size) {

            this._target.deltaHp(this._healAmount);
            Handler.removeObj(this);
        }
    }

    tick() {
        super.tick();
        this.moveInDir(this.position.getDir(this._target.position), this._speed);
    }
}