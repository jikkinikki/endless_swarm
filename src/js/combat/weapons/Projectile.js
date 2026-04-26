import Renderer from "../../engine/handlers/Renderer";
import Obj from "../../engine/Tools/Obj";
import Handler from "../../engine/handlers/Handler";
import TimeHandler from "../../engine/handlers/TimeHandler";

export default class Projectile extends Obj {

    /**
     * @param {import("../../engine/Tools/Vector2").default} position 
     * @param {Number} lifeTime 
     * @param {Number} dir 
     * @param {import("./Weapon").default} weapon 
     */
    constructor(position, lifeTime, dir, weapon) {

        super(position);
        this.weapon = weapon;
        this.weapType = "unknown";
        
        if (weapon) {

            /** @type {import("../../statData/SDWeapon").default} */
            this.weapData = weapon._statData;
            this.weapType = weapon.name;
        }
        else if (weapon != null)
            console.warn("no weapon");

        this.dir = dir || Math.random() * Math.PI * 2;
        this.dir = this.dir == "random" ? Math.random() * Math.PI * 2 : this.dir;
        this.spawnTime = TimeHandler.totGameTime;

        this.lifeTime = lifeTime + Math.random() * 100
        this.size = 40;
        this.collisions = 0;
        this.hitTargets = [];

        this.tickFunc = () => { };

    }

    set anim(anim){

        this._anim = anim;
    }

    get anim(){

        return this._anim ? this._anim : null;
    }

    setTickFunc(func) {

        this.tickFunc = func;
        return this;
    }

    moveInDir(dir, speed) {

        this.position._x += Math.cos(dir) * speed * TimeHandler.deltaTimeSecs;
        this.position._y += Math.sin(dir) * speed * TimeHandler.deltaTimeSecs;
    }

    checkCollision() {


        if (this.isDead)
            return;

        if (!this.weapData || !this.weapon) {

            console.log("missing weapData or weapon", this.weapData, this.weapon, this.weapType);
            return;
        }

        //TODO: use chunking handler and implement a get enemy function.
        const enemies = Handler.getEnemies(this.weapon.owner);

        for (const enemy of enemies) {

            if (!this.weapData)
                return;

            if (this.position.getDist(enemy.position) < this.size && (this.weapData.canHitSame || !this.hitTargets.includes(enemy))) {

                enemy.deltaHp(-this.weapData.phDmg);
                this.collisions++;

                if (!this.weapData.canHitSame)
                    this.hitTargets.push(enemy);

                if (this.collisions >= this.weapData.penetration && this.weapData.penetration != -1)
                    this.killSelf();
            }
        }
    }

    killSelf() {

        Handler.removeObj(this);
        this.isDead = true;
    }

    onRemove() {

        super.onRemove();

        // this.weapon = null;
        this.tickFunc = null;
        this.weapData = null;
        this.hitTargets = null;

    }

    tick() {

        this.tickFunc(this);
        this.checkCollision();

        if (TimeHandler.totGameTime - this.spawnTime > this.lifeTime)
            this.killSelf();
    }

    // render(ctx) {

    //     ctx.save();

    //     let pos = Renderer.worldPosToDrawPos(this.position);
    //     console.log("r");

    //     ctx.translate(pos._x, pos._y);
    //     ctx.rotate(this.dir);
    //     ctx.fillStyle = "red";
    //     ctx.fillRect(0, 0, this.size, this.size);
    //     ctx.restore();
    // }
}