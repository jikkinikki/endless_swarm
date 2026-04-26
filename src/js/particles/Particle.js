// import { Application, Graphics } from 'pixi.js';
import { Assets, Particle as PixiParticle } from "pixi.js";

import Handler from "../engine/handlers/Handler";
import Renderer from "../engine/handlers/Renderer";
import TimeHandler from "../engine/handlers/TimeHandler";
import PixiHandler from "../engine/handlers/PixiHandler";

import particle_square from "../../textures/particles/square.png"
import { Texture } from "pixi.js";

export default class Particle {

    constructor(position, lifeTime, dir) {

        console.log("Particle is deprecated. Use ParticleHandler instead.");
        

        this._position = position;
        this._lifeTime = lifeTime;
        this._spawnTime = TimeHandler.totGameTime;
        this._dir = dir; // Direction in radians

        this._speed = 100;
        this._size = 2;

        this.color = "white";
    }

    tick() {

        if (this._lifeTime > 0) {

            this._lifeTime -= TimeHandler.deltaTimeSecs;

            this.deltaPos();
        }
        else
            Handler.removeObj(this, ["particles"]);
    }

    after() { }

    randomLifetime(min, max) {

        this._lifeTime = Math.random() * (max - min) + min;
        return this;
    }

    randomSpeed(min, max) {

        this._speed = Math.random() * (max - min) + min;
        return this;
    }

    deltaPos() {

        this._position._x += Math.cos(this._dir) * this._speed * TimeHandler.deltaTimeSecs;
        this._position._y += Math.sin(this._dir) * this._speed * TimeHandler.deltaTimeSecs;
    }

    async createSprite() {

        const path = particle_square;

        const fullTexture = await Assets.load(path);
        fullTexture.baseTexture.scaleMode = "nearest";

        return fullTexture;
    }

    onAdd() {

        this._texture = this.createSprite();

        Promise.resolve(this.createSprite()).then(texture => {
            // this._particle = PixiHandler.addParticle(texture);
        
            this._particle = new PixiParticle({
                texture: texture,
                x: 0,
                y: 0,
                scaleX: 2,
                scaleY: 2,
                tint: "white",
            })

            PixiHandler.addParticle(this._particle);
        });
    }

    onRemove() {

        if (this._particle)
            PixiHandler.removeParticle(this._particle);
    }

    render(ctx) {

        if (this._particle) {

            this._particle.x = Renderer.worldPosToDrawPos(this._position).x;
            this._particle.y = Renderer.worldPosToDrawPos(this._position).y;
        }
    }

}