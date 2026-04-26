import Player from "./Player";
import Animation from "../../engine/Animation/Animation";
import Renderer from "../../engine/handlers/Renderer";
import Vector2 from "../../engine/Tools/Vector2";
import Animator from "../../engine/Animation/Animator";
import anim from "./../../../textures/heros/h_all.png";
import WeapCloneLeaver from "../../combat/spells/WeapCloneLeaver";
import WeapSummon from "../../combat/weapons/WeapSummon";
import EntDinoClone from "../EntDinoClone";

export default class PlDino extends Player {
    constructor(position) {
        super("dino", position);

        //TODO: Figure out why the animation need to be offest with 1 extra pixel.
        this.animator = new Animator().addAnims({
            "idle": new Animation(anim, 4, Renderer.speed, 9).setSize(16, 31).setStartOffset(new Vector2(0 * 16, 6 * 32 + 1)),
            "move": new Animation(anim, 4, Renderer.speed * 1.5, 9).setSize(16, 31).setStartOffset(new Vector2(4 * 16, 6 * 32 + 1))
        });

        this.spells = [

            new WeapCloneLeaver(this),
            new WeapSummon(this, EntDinoClone, "team1")
        ];

        this.animator.loadAnim("idle");
    }
}