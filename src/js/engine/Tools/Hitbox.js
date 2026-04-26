import Vector2 from "./Vector2";
import Obj from "./Obj";
import Renderer from "../handlers/Renderer";
import MapHandler from "../../map/MapHandler";
import PixiHandler from "../handlers/PixiHandler";
import { Graphics } from "pixi.js";
import Debug from "../debug/Debug";
import Component from "./Component";

/**
 * @class Hitbox
 * @extends {Component} This class is component based! Add it to a objects component or pass it as loose if not added to component list.
 */
export default class Hitbox extends Component{

    /**
     * @param {Vector2} offset 
     * @param {Vector2} size 
     * @param {Obj} owner 
     */
    constructor(offset, size, owner, isLoose = false){

        super();
        const scale = Renderer.getZoom() / 2;

        this.offset = offset.scale(scale);
        this.size = size.scale(scale);
        this.owner = owner;
        this._isLoose = isLoose;

        this._center = new Vector2(0, 0);

        if (Debug.outlineHitboxes && !this._isLoose)
            this.createHitboxOutline();
    }

    createHitboxOutline() {

        let drawStart = Renderer.worldPosToDrawPos(this.getPosition());

        this._graphicsBox = new Graphics()
            .rect(0, 0, this.size.x, this.size.y)
            .stroke({ color: 0xff00ff, pixelLine: true });

        PixiHandler.addSprite(this._graphicsBox, "debug");
    }

    updateHitboxOutline() {

        let drawStart = Renderer.worldPosToDrawPos(this.getPosition());
        this._graphicsBox.position.set(drawStart.x, drawStart.y);
    }

    getPosition(clone = true) {

        if (clone)
            return this.offset.clone().add(this.owner.position);

        this._center.setxy(this.offset.x, this.offset.y).add(this.owner.position);
        return this._center;
    }

    loadEmptyCorners() {

        this._corners = [
            // new Vector2(0, 0),
            // new Vector2(0, 0),
            // new Vector2(0, 0),
            // new Vector2(0, 0)
        ];
    }

    /**
     * 
     * @returns {Vector2[]}
     */
    getCorners() {

        if (!this._corners) {

            this.loadEmptyCorners();
        }

        this._corners[0] = this.getPosition();
        this._corners[1] = this.getPosition().addxy(0, this.size.y);
        this._corners[2] = this.getPosition().addxy(this.size.x, 0);
        this._corners[3] = this.getPosition().add(this.size);

        return this._corners;
    }

    /**
     * 
     * @param {Vector2} point 
     * @returns {boolean}
     */
    checkPointCollision(point) {
        return point.x >= this.getPosition().x && point.x <= this.getPosition().x + this.size.x &&
            point.y >= this.getPosition().y && point.y <= this.getPosition().y + this.size.y;
    }

    checkAreaCollision(pos, size) {

        const aPos = this.getPosition();
        const bPos = pos;

        return (
            aPos.x < bPos.x + size.x &&
            aPos.x + this.size.x > bPos.x &&
            aPos.y < bPos.y + size.y &&
            aPos.y + this.size.y > bPos.y
        )
    }

    /**
     * 
     * @param {Hitbox} other 
     * @returns {boolean}
     */
    checkHitboxCollision(other) {
        const aPos = this.getPosition(false);
        const bPos = other.getPosition(false);

        return (
            aPos.x < bPos.x + other.size.x &&
            aPos.x + this.size.x > bPos.x &&
            aPos.y < bPos.y + other.size.y &&
            aPos.y + this.size.y > bPos.y
        );
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    debugRender(ctx) {

        if (Debug.outlineHitboxes && !this._isLoose)
            this.updateHitboxOutline();

    }

    onRemove() {

        if (this._graphicsBox) {
            PixiHandler.removeSprite(this._graphicsBox, "debug");
            this._graphicsBox = null;
        }
    }
}