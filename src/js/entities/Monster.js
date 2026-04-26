import Ent from "./Ent";
import Handler from "../engine/handlers/Handler";
import ParticleHandler from "../engine/handlers/ParticleHandler.js";

import Vector2 from "../engine/Tools/Vector2.js";
import PickupCoin from "./../pickups/PickupCoin.js";
import PickupScraps from "./../pickups/PickupScraps.js";
import PickupXP from "../pickups/PickupXP";
import Particle from "../particles/Particle.js";
import AIMMonster from "../AIMover/AIMMonster.js";
import Random from "../engine/Tools/Random";
import Debug from "../engine/debug/Debug.js";

export default class Monster extends Ent {

    constructor(entName, position) {
        super(entName, position);

        this.mover = new AIMMonster(this);

        this._drops = [
            {
                type: PickupXP,
                amount: Random.fromArray([0, 1])
            },
            {
                type: PickupCoin,
                amount: Random.fromArray([0, 1, 1])
            },
            {
                type: PickupScraps,
                amount: Random.fromArray([0, 0, 0, 1, 1])
            }

        ];
    }

    setDropRate(type, amount) {

        for (const drop of this._drops) {

            if (drop.type == type) {

                drop.amount = amount;
                return;
            }
        }

        this._drops.push({
            type: type,
            amount: amount
        });
    }

    deltaHp(delta) {


        if (delta < 0 && !this.isInvurnable) {
            this.createDamageParticles();
        }

        super.deltaHp(delta);
    }

    createDamageParticles() {

        for (let i = 0; i < Math.random() * 3 + 1; i++)
            ParticleHandler.addParticle(this.position.x, this.position.y, .2, Math.random() * Math.PI * 2);
    }

    onRemove() {

        const range = 35;

        if (!Debug.disableDrop)
            for (const drop of this._drops) {

                for (let i = 0; i < drop.amount; i++) {

                    const randOffset = new Vector2(Math.random() * range - range / 2, Math.random() * range - range / 2);

                    // create a new object of the type of the drop
                    const pickup = new drop.type(this.position.clone().add(randOffset));

                    Handler.addObj(pickup, ["pickups"]);
                }
            }
    }

    tick() {

        super.tick();
    }
}