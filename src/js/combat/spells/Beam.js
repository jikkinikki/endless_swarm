import Ent from "../../entities/Ent";
import Handler from "../../engine/handlers/Handler";
import Obj from "../../engine/Tools/Obj";
import Renderer from "../../engine/handlers/Renderer";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Vector2 from "../../engine/Tools/Vector2";

export default class Beam extends Obj {

    /**
     * 
     * @param {Ent} from 
     * @param {Ent} to 
     */
    constructor(from, to, lifetime){

        super(from.position);
    
        this.from = from;
        this.lifetime = lifetime;
        this._spawnTime = TimeHandler._totGameTime;
        this.to = to;
    }

    tick(){

        if(this.to.isDead || this.from.isDead || this._spawnTime + this.lifetime < TimeHandler._totGameTime){

            Handler.removeObj(this, ["projectiles"]);
        }
    }
    
    render(ctx){

        // ctx.save();
        // ctx.beginPath();

        // const from = Renderer.worldPosToDrawPos(this.from.position.clone().add(new Vector2(0, 20)));
        // const to = Renderer.worldPosToDrawPos(this.to.position);
        // ctx.moveTo(from._x, from._y);
        // ctx.lineTo(to._x, to._y);

        // ctx.lineCap = "round";
        // ctx.strokeStyle = "rgba(189, 1, 1, 0.34)";
        // ctx.lineWidth = 5;

        // ctx.stroke();
        // ctx.restore();
    }
}