import Animation from "../engine/Animation/Animation";
import Handler from "../engine/handlers/Handler";
import Obj from "../engine/Tools/Obj";
import Renderer from "../engine/handlers/Renderer";
import TimeHandler from "../engine/handlers/TimeHandler";

import anvil from "./../../textures/other/anvil.png";

export default class Anvil extends Obj {

    constructor(pos) {

        super(pos);

        this.anim = new Animation(anvil, 1, 1, 1).setSize(16, 16);

        this.nearbyTime = 0;
        this.maxNearbyTime = 40;

        this.cd = 0;
    }

    tick() {
        
        if (this.cd > 0)
            this.cd -= TimeHandler.deltaTimeSecs * 1000;
        else{
            if (this.nearbyTime >= this.maxNearbyTime)
                this.openUI();

            this.checkForNearby();
        }

    }

    openUI() {

        this.cd = 2000;
        this.nearbyTime = 0;
        Handler.getEntitiesByTag("UI_anvil")[0].openMenu();
    }

    checkForNearby() {

        let players = Handler.getPlayers();

        let nearby = false;
        for (let i = players.length - 1; i >= 0; i--) {
            let player = players[i];

            if (this.position.getDist(player.position) < 100) {
                nearby = true;
                break;
            }
        }

        if (nearby)
            this.nearbyTime += 30 * TimeHandler.deltaTimeSecs;
        else
            this.nearbyTime = 0;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // ctx.save();

        // ctx.beginPath();

        // let worldPos = Renderer.worldPosToDrawPos(this.position);

        // ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

        // ctx.arc(worldPos.x, worldPos.y, Math.min(this.nearbyTime, this.maxNearbyTime), 0, Math.PI * 2);

        // ctx.fill();

        // ctx.beginPath();

        // ctx.restore();

        this.anim.render(ctx, this.position)
    }


}