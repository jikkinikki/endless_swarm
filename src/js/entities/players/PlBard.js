import Player from "./Player";
import Animation from "../../engine/Animation/Animation";
import Renderer from "../../engine/handlers/Renderer";
import Vector2 from "../../engine/Tools/Vector2";
import Animator from "../../engine/Animation/Animator";
import anim from "./../../../textures/heros/h_all.png";

export default class PlBard extends Player {
    constructor(position) {
        super("bard", position);
    }

    onAdd() {
        super.onAdd();

        const WeapTriggerNotes = require("../../combat/spells/WeapTriggerNotes").default;
        const WeapNotesPlayer = require("../../combat/spells/WeapNotesPlayer").default;

        this.spells = [
            new WeapTriggerNotes(this),
            new WeapNotesPlayer(this)
        ];

        this.animator = new Animator().addAnims({
            "idle": new Animation(anim, 4, Renderer.speed, 9).setSize(16, 32).setStartOffset(new Vector2(0 * 16, 1 * 32)),
            "move": new Animation(anim, 4, Renderer.speed * 1.5, 9).setSize(16, 32).setStartOffset(new Vector2(4 * 16, 1 * 32))
        });

        this.animator.loadAnim("idle");
    }
}