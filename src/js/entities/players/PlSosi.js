import Player from "./Player";
import Animation from "../../engine/Animation/Animation";
import Renderer from "../../engine/handlers/Renderer";
import Vector2 from "../../engine/Tools/Vector2";
import Animator from "../../engine/Animation/Animator";
import WeapLifeDrain from "../../combat/spells/WeapLifeDrain";
import WeapBlackHole from "../../combat/spells/WeapBlackHole";

import sosiAnim from "./../../../textures/heros/sosi.png"
import WeapSummon from "../../combat/weapons/WeapSummon";
import EntCat from "../EntCat";
import WeapCrazyCats from "../../combat/spells/WeapCrazyCats";

export default class PlSosi extends Player {

    constructor(position) {

        super("Sosi", position);

        const weapSummon = new WeapSummon(this, EntCat, "team1", 10000, true);

        this.spells = [

            weapSummon,
            new WeapCrazyCats(this, weapSummon)
        ]

        this.animator = new Animator().addAnims({

            "idle": new Animation(sosiAnim, 4, Renderer.speed, 9).setSize(16, 32).setStartOffset(new Vector2(0 * 16, 0 * 32)),
            "move": new Animation(sosiAnim, 4, Renderer.speed * 1.5, 9).setSize(16, 32).setStartOffset(new Vector2(4 * 16, 0 * 32))
        })

        this.animator.loadAnim("idle");
    }
}