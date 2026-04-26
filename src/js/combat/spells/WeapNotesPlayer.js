import EffSlowness from "../../effects/EffSlowness";
import EffSpeed from "../../effects/EffSpeed";
import Handler from "../../engine/handlers/Handler";
import Inventory from "../../Inventory";
import KeyboardInput from "../../engine/inputs/KeyboardInput";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";

export default class WeapNotesPlayer extends Weapon {

    constructor(owner) {

        super("Note player", "Consume notes to do things");

        this.pickup(owner);

        this.reloadTime = 10 * 1000;

        this._lastReload = -this.reloadTime;

        this._active = false;

        this.keyMapping = {

            "green": "a",
            "blue": "s",
            "red": "d",
        }
    }

    tick() {

        if (this._active) {

            for (const color in this.keyMapping) {
                if (KeyboardInput.getKeyIsDown(this.keyMapping[color])) {

                    if (this._active) {

                        this._active = false;
                        this.activateInvNotes(color);
                        break;
                    }
                }
            }
        }
    }

    activateInvNotes(color) {

        /** @type {Inventory} */
        const inventory = this.owner.inventory;

        const notesCount = inventory.itemCount(`${color} note`);
        console.log(notesCount);

        inventory.tryRemoveItem(`${color} note`, notesCount);

        if (color == "green") {
            this.owner.deltaHp(10 * notesCount);
        }
        else if (color == "blue") {

            this.owner.applyEffect(new EffSpeed(5000, 2));
        }
        else if (color == "red") {

            const enemies = Handler.getEnemies(this.owner);

            for (const enemy of enemies) {
                enemy.deltaHp(-notesCount);
            }
        }
    }

    fire() {

        if (!this.readyToFire())
            return;

        this._lastReload = TimeHandler.totGameTime;

        this._active = true;
    }
}