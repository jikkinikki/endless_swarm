import Ent from "./Ent";
import WeapStabber from "../combat/weapons/WeapStabber";
import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";
import Animator from "../engine/Animation/Animator";
import Vector2 from "../engine/Tools/Vector2";

import anim from "./../../textures/other/cat_sheet.png";

import AIMDino from "../AIMover/AIMDino";

import Weapon from "../combat/weapons/Weapon";
import TimeHandler from "../engine/handlers/TimeHandler";

export default class EntCat extends Ent {

    constructor(position, owner) {
        super("cat", position);

        this.mover = new AIMDino(this);

        this.weapons = [

            new WeapStabber().pickup(this)
        ];

        this._owner = owner;

        this.animator = new Animator().addAnims({
            "idle": new Animation(anim, 4, Renderer.speed, 10).setSize(16, 16).setStartOffset(new Vector2(0 * 16, 0 * 16)),
            "move": new Animation(anim, 4, Renderer.speed * 1.5, 10).setSize(16, 16).setStartOffset(new Vector2(4 * 16, 0 * 16))
        });

        this.animator.loadAnim("idle");

        this._baseSpeed = 100;
        this.maxHp = 100;
        this._hp = this.maxHp;
    }

    tick() {

        super.tick();

        this.deltaHp(-TimeHandler.deltaTimeSecs)
    }
}