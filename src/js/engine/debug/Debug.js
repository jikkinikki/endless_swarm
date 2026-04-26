// import Monster from "../../entities/Monster";
import Handler from "../handlers/Handler";
import KeyboardInput from "../inputs/KeyboardInput";
import MapHandler from "../../map/MapHandler";
import MouseInput from "../inputs/MouseInput";
import Ray from "../Tools/Ray";
import Renderer from "../handlers/Renderer";
import TimeHandler from "../handlers/TimeHandler";
import HandlerBase from "../handlers/HandlerBase";

class Debug extends HandlerBase {
    constructor() {

        super();

        this._debugActive = false;

        this._disableDrop = true;
        this._outlineHitboxes = true;

        this._debugCanvas = document.createElement('canvas');
        this._debugCtx = this._debugCanvas.getContext('2d');
        this._debugCanvas.width = window.innerWidth;
        this._debugCanvas.height = window.innerHeight;


        this.lastPrint = 0;
    }

    get disableDrop(){
        return this._disableDrop && this._debugActive;
    }

    get outlineHitboxes(){
        return this._outlineHitboxes && this._debugActive;
    }

    get debugCtx(){

        return this._debugCtx;
    }

    intervalLimPrint(textToPrint, intervalLim) {

        if (this.lastPrint + intervalLim < TimeHandler.totGameTime) {

            console.log(textToPrint);
            this.lastPrint = TimeHandler.totGameTime;
        }
    }

    tick() {

        if (KeyboardInput.getKeyUp("qa")) {

            const tiles = MapHandler.loadedMap;

            for (let x = 0; x < tiles.length; x++) {
                for (let y = 0; y < tiles[x].length; y++) {
                    const tile = tiles[x][y];

                    if (!tile.walkable)
                        console.log(tile.position.x, tile.position.y);

                    // tile.setWalkable(false);
                }
            }
        }

        if (KeyboardInput.getKeyUp("v")) {

            const mousePos = Renderer.screenToWorldPos(MouseInput.mousePos);
            this.enemyInfo(mousePos);
        }
    }

    sendPlayerRays(ctx, count) {

        const player = Handler.getPlayers()[0];
        const from = Renderer.worldPosToDrawPos(player.getFeetPos());
        
        let fromTileSnapped = player.getFeetPos().clone().scale(1 / MapHandler.getTileSize()).round().scale(MapHandler.getTileSize());
        fromTileSnapped = Renderer.worldPosToDrawPos(fromTileSnapped);
        // const from = Renderer.worldPosToDrawPos(player.position);

        // console.log(player.getFeetPos().toString(), player.position.toString());
        
        for (let i = 0; i < count; i++) {

            const ray = new Ray().posToDir(player.getFeetPos(), Math.PI * 2 * i / count);
            const hits = ray.getTileCollisionsOld(10000, true);

            if (hits.length > 0) {

                // const to = Renderer.worldPosToDrawPos(hits[0]);
                let toTileSnapped = hits[0].clone().scale(1 / MapHandler.getTileSize()).round().scale(MapHandler.getTileSize());
                toTileSnapped = Renderer.worldPosToDrawPos(toTileSnapped);

                ctx.moveTo(from.x, from.y);
                ctx.lineTo(toTileSnapped.x, toTileSnapped.y);
            }
        }
        ctx.stroke();
    }

    enemyInfo(position) {

        // /** @type {Monster[]} */
        const enemies = Handler.getEntitiesByTag("team2");

        for (const enemy of enemies) {

            if (enemy.position.getDist(position) < 50) {
                console.log("enemy found: " + enemy.constructor.name);

                console.log(enemy.position);
                console.log(enemy.mover.moveState);
                console.log(enemy.mover._nextPosDebug);
                console.log(enemy.anim.height);
                console.log("--------------------------------");

            }
        }
    }

    render(ctx) {

        // ctx.save();
        // const walkable = MapHandler.getIsWalkable(Renderer.screenToWorldPos(MouseInput.mousePos));

        // if (walkable) {
        //     ctx.fillStyle = "lightblue";
        // }
        // else {
        //     ctx.fillStyle = "red";
        // }

        // let size = 8;
        // ctx.fillRect(MouseInput.mousePos.x - size / 2, MouseInput.mousePos.y - size / 2, size, size);

        // this.sendPlayerRays(ctx, 1000);

        // ctx.restore();

        // ctx.drawImage(this._debugCanvas, 0, 0);
        // this._debugCtx.clearRect(0, 0, this._debugCanvas.width, this._debugCanvas.height);
    }
}

export default new Debug();