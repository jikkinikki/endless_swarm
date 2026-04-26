import Ent from "./Ent";
import Handler from "../engine/handlers/Handler";
import WeapBoomo from "../combat/weapons/WeapBoomo";
import WeapStabber from "../combat/weapons/WeapStabber";
import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";
import PickupXP from "../pickups/PickupXP";
import AIMover from "../AIMover/AIMover";
import Animator from "../engine/Animation/Animator";
import Vector2 from "../engine/Tools/Vector2";

import anim from "./../../textures/heros/h_all.png";
import AIMDino from "../AIMover/AIMDino";
import Weapon from "../combat/weapons/Weapon";
import TimeHandler from "../engine/handlers/TimeHandler";

export default class EntDinoClone extends Ent {

    constructor(position, owner) {
        super("dinoClone", position);

        this.mover = new AIMDino(this);

        this.weapons = [

            new WeapStabber().pickup(this)
        ];

        for (const weapon of owner.weapons) {

            /** @type {Weapon} */
            const newWeapon = new weapon.constructor();
            newWeapon.setLevel(weapon._lvl);

            this.addWeapon(newWeapon);
        }

        this._owner = owner;

        this.animator = new Animator().addAnims({
            "idle": new Animation(anim, 4, Renderer.speed, 9).setSize(16, 32).setStartOffset(new Vector2(0 * 16, 6 * 32)),
            "move": new Animation(anim, 4, Renderer.speed * 1.5, 9).setSize(16, 32).setStartOffset(new Vector2(4 * 16, 6 * 32))
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