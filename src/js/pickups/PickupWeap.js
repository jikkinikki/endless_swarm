import Weapon from "../combat/weapons/Weapon";
import Pickup from "./Pickup";

export default class PickupWeap extends Pickup {

    constructor(position, weapon) {
        super(position);

        /** @type {Weapon} */
        this.weapon = weapon;
        this.anim = weapon.weapAnim;
    }

    onPickup(picker) {

        this.weapon.pickup(picker);
    }
}