import { Application, Graphics } from 'pixi.js';
// import Handler from "../handlers/Handler";
import PixiHandler from "../handlers/PixiHandler";
import Vector2 from "./Vector2";
// import { Player } from '../../imports';

export default class Obj {

    /**
     * @param {Vector2} position 
     */
    constructor(position) {

        if (position == undefined)
            console.trace("no pos", this.constructor.name);


        /** @type {Vector2} */
        this.position = position;
        this.hidden = false;
        this.tags = [];
        this._components = [];            
    }

    addComponent(component) {
        this._components.push(component);
        component.onAdd();
    }

    removeComponent(component) {
        this._components = this._components.filter(c => c !== component);
        component.onRemove();
    }

    /**
     * @overload
     * @param {Vector2} x
     * @returns {Obj}
     */

    /**
     * @overload 
     * @param {number} x 
     * @param {number} y 
     * @returns {Obj}
     */

    /**
     * @param {Vector2 | number} x
     * @param {number} y
     */
    setPosition(x, y) {

        if (y)
            this.position = new Vector2(x, y);
        else
            this.position = x;

        return this;
    }


    onAdd() {

        // if(this instanceof Player)
            // console.log("Player components: ", this._components);
    }


    tick() {

    }

    after() {


    }
    
    onRemove(){

        if(this._basicSq){

            PixiHandler.removeSprite(this._basicSq, "other");
            this._basicSq = null;
        }
    }

    get basicSq() {

        if (!PixiHandler.isReady)
            return null;

        if (!this._basicSq) {

            this._basicSq = new Graphics();
            this._basicSq.fill(0x000000);
            this._basicSq.rect(0, 0, 5, 5);
            this._basicSq.endFill();
            PixiHandler.addSprite(this._basicSq, "other");
        }

        return this._basicSq;

    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        if (this.anim) {

            this.anim.render(ctx, this.position);
        }
        else {

            let sq = this.basicSq;

            if (sq) {

                const Renderer = require("../handlers/Renderer").default;
                let drawPos = Renderer.worldPosToDrawPos(this.position);

                this.basicSq.position.set(drawPos.x, drawPos.y);
            }
            // const size = Renderer.getZoom();
            // const pos = Renderer.worldPosToDrawPos(this.position);
            // ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
        }
    }

    clone() {

        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)

        clone.position = clone.position.clone();
        return clone;
    }
}