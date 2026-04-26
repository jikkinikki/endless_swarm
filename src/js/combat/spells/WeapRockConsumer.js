import EffSlowness from "../../effects/EffSlowness";
import EffSpeed from "../../effects/EffSpeed";
import Handler from "../../engine/handlers/Handler";
import Inventory from "../../Inventory";
import ItemRock from "../../items/ItemRock";
import KeyboardInput from "../../engine/inputs/KeyboardInput";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";

export default class WeapRockConsumer extends Weapon {

    constructor(owner) {

        super("Rock yum", "I eat Rock!!!");

        this.pickup(owner);

        this.reloadTime = 10 * 1000;

        this._lastReload = -this.reloadTime;

    }

    tick() {


    }

    fire() {

        if (!this.readyToFire())
            return;

        this._lastReload = TimeHandler.totGameTime;

        /** @type {Inventory} */
        const inventory = this.owner.inventory;
    
        const rockCount = inventory.itemCount(ItemRock);
        inventory.tryRemoveItem(ItemRock, rockCount);

        this.owner.deltaHp(rockCount * .5);
    }
}