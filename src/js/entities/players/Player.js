// import Handler from "../Handler";
import { Handler } from "../../imports";
import KeyboardInput from "../../engine/inputs/KeyboardInput";
import Vector2, { Vector2_zero } from "../../engine/Tools/Vector2";
import WeapBounce from "../../combat/weapons/WeapBounce";
import Inventory from "../../Inventory";
import MapHandler from "../../map/MapHandler";
import TimeHandler from "../../engine/handlers/TimeHandler";
import PickupScraps from "../../pickups/PickupScraps";
import PickupCoin from "../../pickups/PickupCoin";
import LightSource from "../../LightSource";
import Ent from "../Ent";
import Pickup from "../../pickups/Pickup";
import WeapEnhialator from "../../combat/weapons/WeapEnhialator";
import UILevelUp from "src/js/UI/UILevelUp";
import WeapBaam from "src/js/combat/weapons/WeapBaam";
import WeapBoomo from "src/js/combat/weapons/WeapBoomo";
import WeapPang from "src/js/combat/weapons/WeapPang";

/**
 * @typedef {import("../../combat/weapons/Weapon").default} Weapon
 */

export default class Player extends Ent {

    /**
     * @param {Vector2} position 
     */
    constructor(entName, position) {
        super(entName, position);

        this._baseSpeed = 100;
        this.maxHp = 100;
        this._maxWeapons = 5;
        this.pickupRange = 200;

        this._hp = this.maxHp/2;
        this._xp = 0;
        this._lvl = 1;

        this.invurnableTime = 40;

        /** @type {Weapon[]} */
        this.spells = [];

        this.randomizeNextBuy();
    }

    onAdd() {

        this.weapons = [];

        // this.addWeapon(new WeapPang())
        // this.addWeapon(new WeapBoomo());
        // this.addWeapon(new WeapBaam());
        // this.addWeapon(new WeapEnhialator());
        this.addWeapon(new WeapBounce());

        this.inventory = new Inventory();

        this.lightSource = new LightSource(this, 1250, "white");

        this.inventory.addItem(new PickupScraps(Vector2_zero).getItem(), 5);
        this.inventory.addItem(new PickupCoin(Vector2_zero).getItem(), 10);

        Handler.addLightSource(this.lightSource);

    }

    onGodMode(){

        this.godMode = !this.godMode;

        for (const weapon of this.weapons) {

            weapon.setLevel(weapon.getMaxLevel());
        }
    }

    onRemove() {

        console.log("On Remove");
        

        Handler.removeLightSource(this.lightSource);

        if(this.animator)
            this.animator.onRemove();
    
        else
            console.log("Plyaer has no animator?");
            
    }

    pickupItem(item, count) {

        this.inventory.addItem(item, count);
    }

    randomizeNextBuy() {
        const Prefabs = require("../../Prefabs").default;
        this.randomBuyableWeapons = Prefabs.getPrefabs("weapons", true, 3, "random");
    }

    deltaXP(delta) {

        this._xp += delta;

        this.tryLevelUp();
    }

    tryLevelUp() {

        if (this._xp >= this._lvl * 10) {

            this._xp -= this._lvl * 10;
            this._lvl++;
            // Handler.getObjsByInstance(UILevelUp)[0].openMenu();

            this.deltaXP(0);
        }
    }

    onNoHp() {

    }

    deltaHp(delta) {

        super.deltaHp(delta);
        // console.trace("source?")
    }

    tryPickupItems() {
        const feetPos = this.getFeetPos();
        // Lazy load ChunkingHandler only when needed
        const ChunkingHandler = require("../../engine/handlers/ChunkingHandler").default;
        const pickups = ChunkingHandler.getNearbyObjsByClass(this, Pickup, this.pickupRange);
        const maxStep = 10;

        for (let r = pickups.length - 1; r >= 0; r--) {
            const pickup = pickups[r];

            this.tryPickupItem(pickup, feetPos, maxStep);
        }
    }

    tryPickupItem(pickup, feetPos, maxStep) {

        if (feetPos.getDist(pickup.position) < 10) {
            pickup.onPickup(this);
            Handler.removeObj(pickup);
        }
        else if (feetPos.getDist(pickup.position) < this.pickupRange) {
            const speed = Math.max(this.pickupRange - feetPos.getDist(pickup.position), 0);

            let totMoveDist = speed * speed * speed / 6000 * TimeHandler.deltaTimeSecs;
            let moveDist = 0;
            let distPerStep = totMoveDist > maxStep ? maxStep : totMoveDist;
            
            while (moveDist < totMoveDist) {

                pickup.position.moveInDir(feetPos, distPerStep);
                moveDist += distPerStep;

                if (feetPos.getDist(pickup.position) < 10) {
                    pickup.onPickup(this);
                    Handler.removeObj(pickup);
                    return;
                }
            }
        }
    }

    tick() {

        super.tick();

        for (const spell of this.spells) {

            spell.tick();
        }

        if (KeyboardInput.getKeyUp("q")) {

            this.spells[0].fire();
        }

        if (KeyboardInput.getKeyUp("e")) {

            this.spells[1].fire();
        }

        this.tryPickupItems();

        if (KeyboardInput.getKeyUp("g")) {

            this.onGodMode();
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        super.render(ctx);

        this.animator.render(ctx, this.position);

        for (const spell of this.spells) {

            spell.render(ctx);
        }
    }

    fixEntityOverlap() { }

    f(x) {

        return 3 * x + 1;
    }

    someFunction(d) {

        return 3;
    }

    doSomething() {

        this.f(1);
    }
}