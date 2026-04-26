import EffNoteMaker from "../../effects/EffNoteMaker";
import Handler from "../../engine/handlers/Handler";
import ProjNote from "../projectiles/ProjNote";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";

export default class WeapTriggerNotes extends Weapon {

    constructor(owner) {

        super("Note trigger", "Trigger nearby notes");

        this.pickup(owner);

        this.reloadTime = 5 * 1000;

        // this._anim = new Animation(staffAnim, 1, Renderer.speed * 2, 1);
        this._lastReload = -this.reloadTime;
    }

    tick() {

        this.applyNotespawnEffect();
    }

    applyNotespawnEffect() {

        /**@type {Ent[]} */
        const enemies = Handler.getEnemies(this.owner);

        for (const enemy of enemies) {

            let foundMatch = false;

            for (const enemyEffect of enemy.effects) {
                if (enemyEffect instanceof EffNoteMaker) {

                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch){
                
                enemy.applyEffect(new EffNoteMaker(10000, 1, this.owner));
            }
        }
    }

    fire() {

        if (!this.readyToFire())
            return;

        this._lastReload = TimeHandler.totGameTime;

        /** @type {ProjNote[]} */
        const notes = Handler.getEntitiesByTag("notes");

        for (const note of notes) {

            if (note._target == this.owner)
                note.trigger();
        }
    }
}