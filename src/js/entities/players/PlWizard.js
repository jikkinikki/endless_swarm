import Player from "./Player";
import Animation from "../../engine/Animation/Animation";
import Renderer from "../../engine/handlers/Renderer";
import Vector2 from "../../engine/Tools/Vector2";
import Animator from "../../engine/Animation/Animator";
import WeapLifeDrain from "../../combat/spells/WeapLifeDrain";
import WeapBlackHole from "../../combat/spells/WeapBlackHole";

import anim from "./../../../textures/heros/h1.png";
import heroAnims from "./../../../textures/heros/h_all.png"

export default class PlWizard extends Player {

    constructor(position) {

        super("wizard", position);

        this.spells = [

            new WeapLifeDrain(this),
            new WeapBlackHole(this),
        ]

        this.animator = new Animator().addAnims({

            "idle": new Animation(heroAnims, 4, Renderer.speed, 9).setSize(16, 32).setStartOffset(new Vector2(0 * 16, 5 * 32)),
            "move": new Animation(heroAnims, 4, Renderer.speed * 1.5, 9).setSize(16, 32).setStartOffset(new Vector2(4 * 16, 5 * 32))
        })

        this.animator.loadAnim("idle");
    }
}