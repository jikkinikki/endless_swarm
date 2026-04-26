/**
 * Optimised particles tracker. Particles are saved as objects in an array.
 *
 * This is still just the start and very slow. Ways more optimisation for many particles at once are needed.
 * The resolve and await part might be quite expensive.
 * Reuse list items, dont shift.
 */

import { Particle, Assets } from "pixi.js";
import PixiHandler from "./PixiHandler";
import HandlerBase from "./HandlerBase";
import TimeHandler from "./TimeHandler";
import spritePath from "../../../textures/particles/square.png"
import Renderer from "./Renderer";

class ParticleHandler extends HandlerBase {

    constructor() {
        super();

        this.freeParticlesCount = 10000;
        this.particles = [];
        this.freeParticles = [];

        for (let i = 0; i < this.freeParticlesCount; i++) {
            this.particles.push({
                lifeTime: 0,
                spawnTime: 0,
                dir: 0,
                particle: null,
                active: false,
            });

            this.freeParticles.push(i);
        }

        this._speed = 100;
        this._color = "white";
        this._scale = 2;
    }

    async createTexture() {

        if (this._spriteLoaded) {

            return this._texture;
        }
        else {

            const texture = await Assets.load(spritePath);
            texture.baseTexture.scaleMode = "nearest";

            return texture;
        }
    }

    createParticle(x, y, texture) {

        return new Particle({
            texture: texture,
            x: x,
            y: y,
            scaleX: this._scale,
            scaleY: this._scale,
            tint: this._color,
        })
    }

    addParticle(x, y, lifeTimeSecs, dir) {

        const xy = Renderer.worldPosToDrawXY(x, y);

        if (this._texture) {

            this._addParticle(xy.x, xy.y, lifeTimeSecs, dir);
        }
        else {

            Promise.resolve(this.createTexture()).then(texture => {

                this._texture = texture;
                this._addParticle(xy.x, xy.y, lifeTimeSecs, dir);
            });
        }
    }

    _addParticle(x, y, lifeTimeSecs, dir) {

        if (this.freeParticlesCount > 0) {

            const index = this.freeParticles[--this.freeParticlesCount];

            this.particles[index].lifeTime = lifeTimeSecs * 1000;
            this.particles[index].spawnTime = TimeHandler.totGameTime;
            this.particles[index].dir = dir;

            if (!this.particles[index].particle) {

                this.particles[index].particle = this.createParticle(x, y, this._texture);
                PixiHandler.addParticle(this.particles[index].particle);
            }
            else {
                this.particles[index].particle.x = x;
                this.particles[index].particle.y = y;
            }
            this.particles[index].active = true;
        }
    }

    tick() {

        this.updateParticles();
    }

    updateParticles() {

        let currentTime = TimeHandler.totGameTime;

        for (let r = this.particles.length - 1; r >= 0; r--) {
            let particle = this.particles[r];

            if (!particle.active)
                continue;

            if (currentTime - particle.spawnTime > particle.lifeTime) {

                this.removeParticle(r);
            }
            else {

                particle.particle.x += Math.cos(particle.dir) * this._speed * TimeHandler.deltaTimeSecs;
                particle.particle.y += Math.sin(particle.dir) * this._speed * TimeHandler.deltaTimeSecs;
            }
        }
    }

    removeParticle(i) {

        let particle = this.particles[i];

        particle.particle.x = -100;
        particle.particle.y = -100;

        this.particles[i].active = false;
        this.freeParticles[this.freeParticlesCount++] = i;
    }
}

export default new ParticleHandler();