import Handler from "../../engine/handlers/Handler";
import Renderer from "../../engine/handlers/Renderer";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Vector2 from "../../engine/Tools/Vector2";
import Projectile from "../weapons/Projectile";
import Animation from "../../engine/Animation/Animation";

import anim from "./../../../textures/pickups/notes.png"
import Particle from "../../particles/Particle";
import ItemNote from "../../items/ItemNote";

export default class ProjNote extends Projectile {

    constructor(position, target, lifeTime, damage, color) {

        super(position, lifeTime, 0, null);

        this._damage = damage;
        this._target = target;
        this._color = color;

        const frameStart = {

            "green": 0,
            "blue": 1,
            "red": 2,
        }

        this._anim = new Animation(anim, 1, 1, 3).setWave(.5, 5).setStartOffset(new Vector2(frameStart[color] * 16, 0));
    }

    checkCollision() {

        // if (this.position.getDist(this._target.position) < this.size) {

        //     this._target.deltaHp(this._healAmount);
        //     Handler.removeObj(this);
        // }
    }

    tick() {

        super.tick();
    }

    trigger() {

        const nearbyEnemies = Handler.getClose(this, Handler.getEnemies(this._target), 1000, 150);

        for (const enemy of nearbyEnemies) {

            enemy.deltaHp(-this._damage);
        }

        this.spawnParticles();

        Handler.removeObj(this);

        this._target.pickupItem(new ItemNote(this._anim, this._color));
    }

    spawnParticles() {

        for (let i = 0; i < 5; i++) {

            let particle = new Particle(this.position.clone(), 0.2, Math.random() * Math.PI * 2);
            particle.color = "lightgreen";
            Handler.addObj(particle, ["particles"]);
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // ctx.save();

        // const lifetimeLeft = 1 - ((TimeHandler.totGameTime - this.spawnTime) / this.lifeTime);

        // ctx.globalAlpha = lifetimeLeft / .1;

        // const drawPos = Renderer.worldPosToDrawPos(this.position);

        // ctx.fillStyle = "light" + this._color;
        // let rad = 2;

        // ctx.fillRect(drawPos.x - rad, drawPos.y - rad, rad * 2, rad * 2);
        this._anim.render(ctx, this.position);
        // ctx.restore();
    }
}