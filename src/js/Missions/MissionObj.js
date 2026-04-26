import Handler from "../engine/handlers/Handler";
import Obj from "../engine/Tools/Obj";
import Renderer from "../engine/handlers/Renderer";
import TimeHandler from "../engine/handlers/TimeHandler";
import Mission from "./Mission";

export default class MissionObj extends Obj {

    constructor(mission, position) {
        super(position);

        /** @type {Mission} */
        this._mission = mission;

        this.chargeupStart = -1;
        this.chargeupTime = 2 * 1000;

        this.rad = 16 * 4;
        this.stage = "idle";
    }


    tick() {

        if(this._mission.done){

            Handler.removeObj(this);
            return;
        }

        if (this.stage == "active") {

            this._mission.tick();

        }
        else {

            let hasNearbyPlayer = false;
            for (const player of Handler.getPlayers()) {

                if (player.position.getDist(this.position) < this.rad) {

                    if (this.chargeupStart == -1)
                        this.chargeupStart = TimeHandler.totGameTime;

                    hasNearbyPlayer = true;
                }
            }

            if (!hasNearbyPlayer)
                this.chargeupStart = -1;

            if (this.getPercLoaded() >= 1)
                this.startMission();
        }

    }

    startMission() {

        this.stage = "active";
        this._mission.onMissionStart();
    }

    getPercLoaded() {

        if (this.chargeupStart == -1)
            return 0;

        return (TimeHandler.totGameTime - this.chargeupStart) / this.chargeupTime;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // if (this.stage != "idle")
        //     return;

        // ctx.save();
        // const drawPos = Renderer.worldPosToDrawPos(this.position);
        // ctx.ellipse(drawPos.x, drawPos.y, this.rad, this.rad, 0, 0, Math.PI * 2);
        // ctx.stroke();

        // if (this.chargeupStart != -1) {

        //     ctx.beginPath();

        //     const percRad = this.rad * (TimeHandler.totGameTime - this.chargeupStart) / this.chargeupTime;

        //     ctx.ellipse(drawPos.x, drawPos.y, percRad, percRad, 0, 0, Math.PI * 2);
        //     ctx.fill();
        // }
        // ctx.restore();
    }
}