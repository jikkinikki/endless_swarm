import Obj from "../engine/Tools/Obj.js";
import Handler from "../engine/handlers/Handler.js";

import TimeHandler from "../engine/handlers/TimeHandler.js";
import Effect from "../effects/Effect.js";
import ParGravity from "../particles/ParGravity.js";
import MapHandler from "../map/MapHandler.js";
import EffRockify from "../effects/EffRockify.js";
import Vector2 from "../engine/Tools/Vector2.js";
import Animation from "../engine/Animation/Animation.js";
import Hitbox from "../engine/Tools/Hitbox.js";
import SDEnt from "../statData/SDEnt.js";
// import ChunkingHandler from "../engine/handlers/ChunkingHandler.js";
// import Player from "./players/Player.js";

import jsonData from "../../json_data/entity_data.json";
import Renderer from "../engine/handlers/Renderer.js";


export default class Ent extends Obj {

    constructor(entName, position) {
        super(position);

        this.isDead = false;
        this._maxWeapons = 1000;
        this.entName = entName;

        this.startInvurnableTime = 0;
        this.isInvurnable = false;

        /** @type {Weapon[]} */
        this.weapons = [];
        this.listBuffer = [];

        /** @type {Effect[]} */
        this.effects = [];

        this._statData = new SDEnt(jsonData, entName);
    }

    /**
     * @returns {Animation}
     */
    get anim() {

        if (this._anim)
            return this._anim;

        if (this.animator)
            return this.animator.getActiveAnim();
    }

    isReady() {

        if (this.anim)
            return this.anim.ready;

        return true;
    }

    setAnimState(state) {

        if (this.animator)
            this.animator.loadAnim(state);
    }

    get speed() {

        return this._statData.moveSpeed;
    }

    tick() {

        if (this.anim && !this.anim.ready)
            return;

        if (this.mover)
            this.mover.tick();


        for (const Weapon of this.weapons) {

            Weapon.tick();
        }

        for (const effect of this.effects) {

            effect.tick();
        }

        if (this.isInvurnable && TimeHandler.totGameTime - this.startInvurnableTime >= this._statData.invurnableTime) {

            this.isInvurnable = false;
        }

        // this.findEntityOverlap();
    }

    after() {
        // this.fixEntityOverlap();
    }

    /**
     * 
     * @param {import("./players/Player.js").Weapon} weapon 
     */
    addWeapon(weapon) {

        if (this._maxWeapons && this.weapons >= this._maxWeapons) {

            console.log("cant add more weapons to player!");
            return;
        }

        weapon.pickup(this);
        this.weapons.push(weapon);
    }

    /**
     * 
     * @param {import("src/js/combat/weapons/Weapon")} weapon 
     */
    removeWeapon(weapon) {

        this.weapons.splice(this.weapons.indexOf(weapon), 1);
    }

    deltaHp(delta) {

        if (typeof delta != "number" || isNaN(delta))
            console.trace(delta, "is not a number");

        if (delta < 0 && this.isInvurnable)
            return;

        this._statData.deltaHp(delta);

        if (this._statData.hp <= 0 && !this.isDead) {

            this.onNoHp();
            // this._statData.hp = 0;
        }
        else {

            if (delta < 0)
                this.isInvurnable = true;

            this.startInvurnableTime = TimeHandler.totGameTime;
        }
    }

    onNoHp() {

        this.isDead = true;
        Handler.removeObj(this);

        for (let i = 0; i < 0; i++) {

            Handler.addObj(new ParGravity(this.position.clone(), -1, Math.random() * Math.PI * 0.6 + Math.PI * 1.2)
                .randomSpeed(80, 200)
                .randomLifetime(0.3, 0.38)
                , ["particles"]);
        }

        for (const effect of this.effects)
            effect.onDeath();
    }

    onRemove() {

        for (const weapon of this.weapons)
            weapon.onRemove();

        this.weapons.length = 0;
        this.effects.length = 0;
    }

    /**
     * 
     * @param {Effect} effect 
     */
    applyEffect(effect) {

        this.effects.push(effect);
        effect.apply(this);
    }

    hasEffect(type) {

        for (const effect of this.effects) {

            if (effect instanceof type) {
                return true;
            }
        }

        return false;
    }

    removeEffect(effect) {

        this.effects.splice(this.effects.indexOf(effect), 1);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // ctx.save();

        // if (this.hasEffect(EffRockify)) {
        //     ctx.filter = "contrast(20%)";
        // }

        super.render(ctx);

        // ctx.restore();

        // for (const Weapon of this.weapons) {

        //     Weapon.render(ctx);
        // }

        // // if (this.getFeetBox())
        this.getFeetBox().debugRender(ctx);

        // if (this.getCollisionBox())
        //     this.getCollisionBox().debugRender(ctx);

        // if (this.getFeetPos()){

        //     let rad = 2;
        //     let drawPos = Renderer.worldPosToDrawPos(this.getFeetPos());
        //     ctx.fillStyle = "blue";
        //     ctx.fillRect(drawPos.x - rad, drawPos.y - rad, rad * 2, rad * 2);
        // }
    }

    getFeetPos(debug = false) {

        const anim = this.anim;

        if (!anim.ready) {

            if (debug) {

                console.trace("anim not ready, cant get size!");
                // console.log("anim not ready, cant get size!");
            }

            return this.position.clone();
        }

        return this.position.clone().addxy(anim.width / (anim.scale * 2), anim.height);
    }

    /**
     * @returns {Hitbox}
     */
    getFeetBox() {

        if (!this._feetBox) {

            let anim;

            if (this.animator)
                anim = this.animator.getActiveAnim();
            else
                anim = this.anim;

            if (!anim.ready) {

                console.log("Anim not ready, cant get feet box!");
                return new Hitbox(new Vector2(0, 0), new Vector2(0, 0), this, true);
            }

            this._feetBox = new Hitbox(new Vector2(-8, 8), new Vector2(this.anim.width, Math.abs(this.anim.height - 20)), this);
            this.addComponent(this._feetBox);

        }

        return this._feetBox;
    }

    getCollisionBox() {
        if (!this._collisionBox) {

            let anim;

            if (this.animator)
                anim = this.animator.getActiveAnim();
            else
                anim = this.anim;

            if (!anim.ready) {

                console.log("Anim not ready, cant get feet box!");
                return new Hitbox(new Vector2(0, 0), new Vector2(0, 0), this, true);
            }

            this._collisionBox = new Hitbox(new Vector2(-8, 0), new Vector2(this.anim.width, Math.abs(this.anim.height)), this);
            this.addComponent(this._collisionBox);
        }
        return this._collisionBox;
    }

    getCornerWallColssions() {

        const corners = this.getFeetBox().getCorners();
        let collidingData = [];

        for (const corner of corners) {

            if (!MapHandler.getIsWalkable(corner)) {

                collidingData.push({
                    corner: corner.clone(),
                    colliding: true
                });
            }

            else {

                collidingData.push({
                    corner: corner.clone(),
                    colliding: false
                });
            }
        }

        return collidingData;
    }

    validateMove(dir, amount, force = false) {

        if (force)
            return true;

        if (!this.anim.ready) {

            console.trace("anim not ready!");
            return false;
        }

        for (const corner of this.getFeetBox().getCorners()) {

            const newPos = corner.moveInDir(dir, amount);

            if (!MapHandler.getIsWalkable(newPos)) {

                return false;
            }
        }

        return true;
    }

    moveInDir(dir, amount, force = false) {

        if (!this.validateMove(dir, amount, force))
            return false;

        this.position.moveInDir(dir, amount);
        return true;

    }

    // moveInDir(dir, amount, force = false) {

    //     if (force) {
    //         this.position = this.position.clone().moveInDir(dir, amount);
    //         return true;
    //     }

    //     if (!this.anim.ready) {

    //         console.trace("anim not ready!");
    //         return false;
    //     }

    //     // this.setAnimState("move")

    //     const corners = this.getFeetBox().getCorners();
    //     let canMove = true;

    //     for (const corner of corners) {

    //         const newPos = corner.moveInDir(dir, amount);

    //         if (!MapHandler.getIsWalkable(newPos)) {

    //             canMove = false;
    //             break;
    //         }
    //     }

    //     if (canMove) {
    //         this.position.moveInDir(dir, amount);
    //     }

    //     return canMove;
    // }
}