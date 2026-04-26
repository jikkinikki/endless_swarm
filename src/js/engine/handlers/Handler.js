// import Ent from "./entities/Ent"; // Create circular dependency :()
import Obj from "../Tools/Obj";
import Ray from "../Tools/Ray";
import Renderer from "./Renderer";
import TimeHandler from "./TimeHandler";
import Vector2 from "../Tools/Vector2";
// import Ent from "../../entities/Ent";
import MapHandler from "../../map/MapHandler";
import ShadowsHandler from "./ShadowsHandler";
import CameraController from "./CameraController";
import HandlerBase from "./HandlerBase";
// import Player from "./players/Player";
import _PauseObj_ from "../../objects/_PauseObj_";
import KeyboardInput from "../inputs/KeyboardInput";
import Monster from "src/js/entities/Monster";
import Projectile from "src/js/combat/weapons/Projectile";
import PixiHandler from "./PixiHandler";

class Handler {

    constructor() {
        /** @type {Object.<string, Set<Obj>>} */
        this._worldObjectsTagged = {};
        this._worldObjects = [];
        this._paused = false;
        this.lightSources = [];
        this._classMap = new Map();

        this.renderTagLayerOrder = [

            "pause",
            "map",
            "shadows",
            "other",
            "entities",
            "lightSource",
            "temp_tile",
            "UI",
            "debug"
        ];

        this.tickTagLayerOrder = [

            "map",
            "other",
            "entities",
            "lightSource",
            "temp_tile",
            "pause",
            "UI"
        ];

        this._pauseMarker = new _PauseObj_();
        this.addObj(this._pauseMarker, ["pause"]);

        this.idCounter = 0;

        let i = 0;
        for (const layer of this.renderTagLayerOrder)
            PixiHandler.addLayer(layer, i++);

    }

    set paused(p) {

        this._paused = p;
        TimeHandler.wasPaused = true;
    }

    get paused() {

        return this._paused;
    }

    getAllClasses(obj) {
        const classes = new Set();
        let proto = Object.getPrototypeOf(obj);
        while (proto && proto.constructor !== Object) {
            classes.add(proto.constructor);
            proto = Object.getPrototypeOf(proto);
        }
        return classes;
    }

    //TODO: ADD a buffer that makes sure all things like animation images are loaded before obj is added to world.
    //TODO: Add befure that adds object at start of next frame.
    /**
     * 
     * @param {Obj} obj 
     * @param {*} tags 
     * @returns 
     */
    addObj(obj, tags) {

        if (typeof obj != "object") {

            console.trace(typeof obj);
            return;
        }

        tags = tags || ["none"];

        obj.tags = tags;
        obj.classes = this.getAllClasses(obj);

        // if(obj.classes.has(Projectile))
        // console.log("proj added", obj.weapType);

        obj.id = this.idCounter++;

        if (obj.entName)
            obj.id = obj.entName + "_" + obj.id;

        this._worldObjects.push(obj);

        for (const tag of tags) {

            if (!this.tagExists(tag)) {
                this._worldObjectsTagged[tag] = new Set();
            }

            if (!this._worldObjectsTagged[tag].has(obj))
                this._worldObjectsTagged[tag].add(obj);
            else
                console.trace("Entity already added!", obj);
        }

        // Add to class map
        for (const cls of obj.classes) {
            if (!this._classMap.has(cls))
                this._classMap.set(cls, new Set());

            this._classMap.get(cls).add(obj);
        }

        if (!obj.onAdd)
            console.trace("Entity has no onAdd method!", obj);

        obj.onAdd();

        //find the first tag that is in the renderTagLayerOrder
        let layer = this.renderTagLayerOrder.find(tag => obj.tags.includes(tag));
        if (!layer)
            layer = "other";

        if (obj.anim) {

            obj.anim._layer = layer;

            if (obj.anim.sprite)
                PixiHandler.addSprite(obj.anim.sprite, layer);
        }

        if (obj.animator) {

            obj.animator._layer = layer;
        }

    }

    addLightSource(lightSource, otherTags = []) {

        this.lightSources.push(lightSource);
    }

    removeLightSource(lightSource) {

        this.lightSources.splice(this.lightSources.indexOf(lightSource), 1);
    }

    tagExists(tag) {

        return Object.keys(this._worldObjectsTagged).includes(tag);
    }

    getEnemies(entity) {

        if (this._worldObjectsTagged["team1"].has(entity))
            return this.tagExists("team2") ? this.getEntitiesByTag("team2") : [];

        return this.tagExists("team1") ? this.getPlayers() : [];
    }

    /** Get closest entities up to "lim" to main entity from others list.
     * 
     * @param {Obj} main 
     * @param {Obj[]} others 
     * @param {Number} lim 
     * @returns {Obj[]}
     */
    getClose(main, others, lim = 1, distLim) {
        if (!Array.isArray(others) || others.length === 0 || !main || !main.position)
            return [];

        const mainPos = main.position;

        if (!(mainPos instanceof Vector2))
            console.trace("mainPos not set or not a Vector2", mainPos);

        if (distLim)
            others = others.filter(ent => mainPos.getDist(ent.position) < distLim);

        return others
            .map(ent => ({ ent, dist: mainPos.getDist(ent.position) }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, lim)
            .map(obj => obj.ent);
    }

    /** Get closest entity to main entity from others list.
     * 
     * @param {Obj} main 
     * @param {Obj[]} others 
     * @returns 
     */
    getClosest(main, others, maxDist = -1) {

        if (typeof others != "object" || others.length == 0)
            return main;

        if (main == undefined)
            return others[0];

        const mainPos = main.position;

        let closest = others[0];
        let closestDist = mainPos.getDist(closest.position);

        for (const other of others) {

            let dist = mainPos.getDist(other.position);

            if (closestDist > dist && (maxDist == -1 || dist < maxDist)) {

                closestDist = dist;
                closest = other;
            }
        }

        if (maxDist != -1 && closestDist > maxDist)
            return null;

        return closest;
    }

    /**
     * @param {string} tag 
     * @returns {Array<Obj>}
     */
    getEntitiesByTag(tag) {
        if (!this.tagExists(tag))
            console.log("missing tag:", tag);

        return this.tagExists(tag) ? Array.from(this._worldObjectsTagged[tag]) : [];
    }

    //TODO: Look over tag system! IF we adding multiple entities if they have multiple tags?
    // Tag filter does not work if we add multiple tags to entity and only remove by 1 of the tags.
    // Do we really need to pass in the tags? Does the entity not store the tags on itself?

    /**
     * 
     * @param {Obj} obj 
     * @param {String[]} tags 
     */
    removeObj(obj, tags) {
        if (!obj || obj == null) return;

        tags = obj.tags;

        let found = false;

        if (obj.anim && obj.anim != null) {

            if (obj.anim.sprite != null) {
                PixiHandler.removeSprite(obj.anim.sprite, obj.anim._layer);
                // PixiHandler.removeSprite(obj.anim.shadow, "shadows");
            }

            obj.anim.sprite = null;
            obj.anim.shadow = null;
        }

        if (Array.isArray(obj._components)) {

            for (const component of obj._components) {
                obj.removeComponent(component);
            }
        }
        else{
            console.log("obj._components is not an array. It is: ", obj._components);
            
        }

        // Remove from main objects array
        let objI = this._worldObjects.indexOf(obj);
        if (objI != -1) {
            this._worldObjects.splice(objI, 1);
            found = true;
        }

        // Remove from tagged sets
        for (const key of tags) {
            if (this._worldObjectsTagged[key]?.has(obj)) {
                this._worldObjectsTagged[key].delete(obj);
                found = true;
            }
        }

        // Remove from class map
        for (const cls of this.getAllClasses(obj)) {
            const set = this._classMap.get(cls);
            if (set?.has(obj)) {
                set.delete(obj);
                found = true;
            }
        }

        if (!found) {
            // console.trace("Entity not found in any collection", obj, tags);
        }

        // Call onRemove after all cleanup is done
        if (obj.onRemove) {
            obj.onRemove();
        }
    }

    removeObjectFromClsList(obj) {
        // Remove from _classMap
        const cls = obj.constructor;
        const set = this._classMap.get(cls);

        if (set) {
            set.delete(obj);
            // Optional: clean up empty sets
            // if (set.size === 0) this._classMap.delete(cls);
        }
    }

    getPlayers() {

        const Player = require('../../entities/players/Player').default; // adjust the path
        let results = this.getObjsByInstance(Player);
        return results;
    }

    // getObjsByInstance(instance) {

    //     return this._worldObjects.filter(obj => obj instanceof instance);
    // }

    /**
     * Returns all objects that are instances of the given class.
     *
     * @template T
     * @param {new (...args: any[]) => T} cls - The class constructor to match.
     * @returns {Array<T>} An array of instances of the given class.
     */
    getObjsByInstance(cls) {
        return Array.from(this._classMap.get(cls) || new Set());
    }

    tick() {

        if (KeyboardInput.getKeyUp("c")) {

            console.log(this._classMap.get(Monster), this._classMap.get(Monster).size);
        }

        this.sortWorldObjectsTick();

        let startI = this.paused ? this._worldObjects.indexOf(this._pauseMarker) : 0;

        for (let i = startI; i < this._worldObjects.length; i++) {

            if (this._worldObjects[i].tags.includes("pause"))
                continue;

            this._worldObjects[i].tick();
        }

        for (let i = startI; i < this._worldObjects.length; i++) {

            if (this._worldObjects[i].tags.includes("pause"))
                continue;

            if (!this._worldObjects[i].after)
                console.log(this._worldObjects[i]);


            this._worldObjects[i].after();
        }
    }

    /**
     * @returns {Vector2}
     */
    getCameraCenter() {
        return CameraController.getAdjustment(this.getPlayers()[0].position.clone());
    }

    isInsideCamera(pos, size) {

        if (typeof pos == "undefined")
            return true;

        const dist = this.getCameraCenter().clone().add(pos.clone().scale(-1));

        if (Math.abs(dist.x) > Renderer.canvas.width / 2 + 16 || Math.abs(dist.y) > Renderer.canvas.height / 2 + 16)
            return false;

        return true;
    }

    /**
     * @param {"left" | "right" | "top" | "bottom"} side 
     * @returns {boolean}
     */
    getCameraSide(side) {

        const cameraCenter = this.getCameraCenter();

        if (side == "left")
            return cameraCenter.x - Renderer.canvas.width / 2;

        if (side == "right")
            return cameraCenter.x + Renderer.canvas.width / 2;

        if (side == "top")
            return cameraCenter.y - Renderer.canvas.height / 2;

        if (side == "bottom")
            return cameraCenter.y + Renderer.canvas.height / 2;

        console.log("Invalid side:", side);

    }

    sortWorldObjectsRendering() {

        this._worldObjects.sort((a, b) => {

            if (a.position == undefined)
                return 1;

            if (b.position == undefined)
                return -1;

            return this.getObjPos(a).y - this.getObjPos(b).y;
        })

        this._worldObjects.sort((b, a) => {

            return this.getTagLayer(b.tags[0], "render") - this.getTagLayer(a.tags[0], "render");
        });
    }

    sortWorldObjectsTick() {

        this._worldObjects.sort((b, a) => {

            return this.getTagLayer(b.tags[0], "tick") - this.getTagLayer(a.tags[0], "tick");
        });
    }

    getObjPos(obj) {

        if (obj.getFeetPos)
            return obj.getFeetPos();

        return obj.position;
    }

    getTagLayer(tag, type) {

        if (!["render", "tick"].includes(type))
            console.log("Invalid type:", type);

        if (type == "render")
            return this.renderTagLayerOrder.indexOf(tag) != -1 ? this.renderTagLayerOrder.indexOf(tag) : this.renderTagLayerOrder.indexOf("other");

        if (type == "tick")
            return this.tickTagLayerOrder.indexOf(tag) != -1 ? this.tickTagLayerOrder.indexOf(tag) : this.tickTagLayerOrder.indexOf("other");
    }

    /**
     * @param {Renderer} renderer 
     */
    render(renderer) {

        // loop through all objects and run render
        let obj;

        let startI = this.paused ? this._worldObjects.indexOf(this._pauseMarker) : 0;

        for (let i = startI; i < this._worldObjects.length; i++) {

            obj = this._worldObjects[i];

            if (obj.tags.includes("pause"))
                continue;

            obj.render(renderer.ctx);
        }

        PixiHandler.render();
    }

    reset() {

        while (this._worldObjects.length > 0) {
            this.removeObj(this._worldObjects[0]);
        }

        this._worldObjects = [];
        this._worldObjectsTagged = {};
        this._classMap = new Map();
        this.lightSources = [];
        this._paused = false;
        this._pauseMarker = new _PauseObj_();
        this.addObj(this._pauseMarker, ["pause"]);
    }
}

let handler = new Handler();

export default handler;