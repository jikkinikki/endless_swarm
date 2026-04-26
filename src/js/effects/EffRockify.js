import Ent from "../entities/Ent";
import ItemRock from "../items/ItemRock";
import Effect from "./Effect";
import EffSlowness from "./EffSlowness";

export default class EffRockify extends Effect {

    constructor(duration, amplifier, caster) {

        super(duration, amplifier);

        this.setCaster(caster);

    }

    apply(target) {

        super.apply(target);
        target.applyEffect(new EffSlowness(this._totDuration, 0.1));
    }

    onDeath() {

        const inventory = this._caster.inventory;

        if (inventory.itemCount(ItemRock) < 100)
            inventory.addItem(new ItemRock(), 1);
    }

    resetTarget() { }

    calcWeight() {

        return this._amplifier;
    }
}