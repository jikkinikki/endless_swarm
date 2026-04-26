import Vector2 from "../Tools/Vector2";
import Handler from "./Handler";

class Renderer {

    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {

        this.canvas = canvas;
        this.canvas.width = canvas.offsetWidth;
        this.canvas.height = canvas.offsetHeight;
        // this.ctx = canvas.getContext("2d", {alpha: "false"});
        // this.ctx.imageSmoothingEnabled = false;
        this.ctx = undefined;
        this.speed = 4;
    }

    /**
     * 
     * @param {Vector2} position 
     * @param {boolean} makeClone 
     * @returns 
     */
    worldPosToDrawPos(position, makeClone = true) {

        // const x = -this.width * this.scale / 2;
        // const y = -this.height * this.scale / 2;

        // const screenStart = Handler.getPlayers()[0].position;
        const screenStart = Handler.getCameraCenter();

        if (!makeClone)
            return position.setxy(
                position._x - screenStart.x + this.canvas.width / 2,
                position._y - screenStart.y + this.canvas.height / 2)

        const offset = new Vector2(
            position._x - screenStart.x + this.canvas.width / 2,
            position._y - screenStart.y + this.canvas.height / 2)

        return offset;
        // ctx.drawImage(this.img, this.width * frameStart + this.startOffset.x, this.startOffset.y, this.width, this.height,
        // x, y, this.width * this.scale, this.height * this.scale)
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    worldPosToDrawXY(x, y) {

        const screenStart = Handler.getCameraCenter();

        const offset = {
            x: x - screenStart.x + this.canvas.width / 2,
            y: y - screenStart.y + this.canvas.height / 2
        }

        return offset;
        // ctx.drawImage(this.img, this.width * frameStart + this.startOffset.x, this.startOffset.y, this.width, this.height,
        // x, y, this.width * this.scale, this.height * this.scale)
    }

    screenToWorldPos(pos) {

        pos = pos.clone();
        return pos.add(Handler.getCameraCenter()).add(new Vector2(this.canvas.width / 2, this.canvas.height / 2).scale(-1));
    }

    screenToTilePos(pos) {

        pos = this.screenToWorldPos(pos);
        pos.scale(1 / (8 * this.getZoom())).round();
        return pos;
    }

    getZoom() {

        return 4;
    }
}

export default new Renderer(document.getElementsByTagName("canvas")[0]);