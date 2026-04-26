import Player from "./Player";
import Animation from "../../engine/Animation/Animation";
import Renderer from "../../engine/handlers/Renderer";
import Vector2 from "../../engine/Tools/Vector2";
import Animator from "../../engine/Animation/Animator";
import anim from "./../../../textures/heros/h_all.png";
import WeapRocker from "../../combat/spells/WeapRocker";
import WeapRockConsumer from "../../combat/spells/WeapRockConsumer";
import WeapJordInMe from "../../combat/spells/WeapJordInMe";

export default class PlDwarf extends Player {
    
    constructor(position) {
        super("dwarf", position);

        this.spells = [

            new WeapRockConsumer(this),
            new WeapJordInMe(this),
            new WeapRocker(this),
        ];

        this.animator = new Animator().addAnims({
            "idle": new Animation(anim, 4, Renderer.speed, 9).setSize(16, 32).setStartOffset(new Vector2(0 * 16, 9 * 32)),
            "move": new Animation(anim, 4, Renderer.speed * 1.5, 9).setSize(16, 32).setStartOffset(new Vector2(4 * 16, 9 * 32))
        });

        this.animator.loadAnim("idle");
    }
}