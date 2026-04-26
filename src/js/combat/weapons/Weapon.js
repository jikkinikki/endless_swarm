import Obj from "../../engine/Tools/Obj";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Vector2 from "../../engine/Tools/Vector2";
import SDWeapon from "../../statData/SDWeapon";
import jsonData from "../../../json_data/weapon_data.json";
import { Handler } from "src/js/imports";


/**
 * @typedef {import('../../entities/Ent').default} Ent
 */

export default class Weapon {

    constructor(name, desc) {
        this.position = new Vector2(0, 0);
        this.name = name;
        this.desc = desc ? desc : "no desc added";

        // Initialize stat data first
        this._statData = new SDWeapon(jsonData, name);
        this._lastReload = -1000 * 300;

        this.setLevel(0);
        this.pickedUp = false;
    }

    getNextLevelInfo() {
        if (!this._statData._shop_data || this._lvl + 1 >= this._statData._shop_data.length) {
            return null;
        }
        return this._statData._shop_data[this._lvl + 1];
    }

    isMaxLevel() {
        return this._lvl >= this._statData._shop_data.length - 1;
    }

    getMaxLevel() {
        return this._statData._shop_data.length - 1;
    }

    pickup(owner) {
        /** @type {Ent} */
        this.owner = owner;
        this._statData.setOwner(owner);
        this.pickedUp = true;
        return this;
    }

    setLevel(lvl) {
        this._lvl = lvl;
        this._statData.setLevel(lvl);
        return this;
    }

    /**
     * @description Check if the weapon is ready to fire. Use tryToFire() instead if you want to fire if True.
     * @returns {boolean}
     */
    readyToFire() {
        return TimeHandler.totGameTime - this._lastReload > this._statData.cooldown;
    }

    /**
     * @description Try to fire the weapon. !-Fires-! if readyToFire() is true.
     * @param {Obj} proj - The projectile to fire. Can be undefined if manual firing.
     * @returns {boolean} true if ready, false if not.
     */
    tryToFire(proj) {
        
        if (!this.readyToFire()) {
            return false;
        }

        if(proj)
            Handler.addObj(proj);

        this._lastReload = TimeHandler.totGameTime;
        return true;
    }

    timeUntilReady() {
        return Math.max(0, this._statData.cooldown - (TimeHandler.totGameTime - this._lastReload));
    }

    onRemove() {
        
        this._statData.setOwner(null);
        this._statData = null;
        this.owner = null;
    }

    /**
     * Use for activatable stuff
     */
    fire() {
        console.log("not implemented");
    }

    /*
    * Use this for passive stuff. Like fire projectile every few weconds.
    */
    tick(){


    }

    render(ctx) {
        // Implementation left empty as per original
    }
}