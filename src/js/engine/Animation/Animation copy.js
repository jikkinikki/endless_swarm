import Handler from "../handlers/Handler";
import Renderer from "../handlers/Renderer";
import Vector2 from "../Tools/Vector2";
import TimeHandler from "../handlers/TimeHandler";

export default class Animation {

    constructor(path, frames, speed, totalFrames) {

        this.path = path;
        this.frames = frames;
        this.speed = speed;
        this.totalFrames = totalFrames || frames;
        this._rotationOffset = 0;

        this.currentFrame = 0;
        this.spawnTime = TimeHandler.totGameTime;
        this.mirror = false;
        this.ready = false;
        // this.scale = Renderer.getZoom() / 2;
        this.scale = 2;

        this.img = new Image();
        this.img.addEventListener("load", () => {

            this.ready = true;

            if (!this._forceSize) {

                this.width = this.img.width / this.totalFrames;
                this.height = this.img.height;
            }
        });

        if (typeof path != "string")
            console.trace("path not set");

        if (path == "undefined" || path.includes("undefined"))
            console.trace("path not set");

        this.img.src = path;

        this.framesOffset = 0;

        this.startOffset = new Vector2(0, 0);

        this.spinSpeed = 0;
        this.spinOffset = 1;
        this._forceSize = false;
    }

    setWave(speed, height) {

        this._waveSpeed = speed;
        this._waveHeight = height;
        return this;
    }

    setRotationOffset(rotation) {

        this._rotationOffset = rotation;
        return this;
    }

    deltaRotation(delta) {
        
        // console.log("offs", this._rotationOffset);
        
        this._rotationOffset += delta;
        return this;
    }

    setShadow(width, offset = 0, opacity = 0.3) {
        
        this._shadowWidth = width;
        this._shadowOffset = offset;
        this._shadowOpacity = opacity;
        return this;
    }

    setSize(w, h) {

        this._forceSize = true;
        this.width = w;
        this.height = h;
        return this;
    }

    setStartOffset(offset) {

        // if(offset2)
            // offset = new Vector2(offset, offset2);

        this.startOffset = offset;
        return this;
    }

    faceDirection(dir) {

        // console.log(dir);
        dir = Math.abs(dir);
        this.mirror = Math.PI * 0.5 < dir && dir < 1.5 * Math.PI ? true : false;
    }

    setSpin(speed, offset) {

        this.spinSpeed = speed;
        this.spinOffset = offset || 1;

        return this;
    }

    /**
     * What frame to start on. It will always have this frame as frame 0.
     * 
     * @param {Number} offset 
     * @returns 
     */
    setFramesOffset(offset) {

        this.framesOffset = offset;
        return this;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx, position) {

        if (!this.ready)
            return;

        ctx.save();
        // ctx.filter = "contrast(50%)";
        // const playerPos = Handler.getPlayers()[0].position;
        const playerPos = Handler.getCameraCenter().round();
        
        const rotation = (TimeHandler.totGameTime / 1000 * this.spinSpeed) % (Math.PI * 2) + this._rotationOffset;

        ctx.translate(position._x - playerPos.x + Renderer.canvas.width / 2, position._y - playerPos.y + Renderer.canvas.height / 2);
        
        ctx.rotate(rotation);

        // Draw shadow if enabled
        if (this._shadowWidth) {
            ctx.save();
            ctx.beginPath();
            ctx.globalAlpha = this._shadowOpacity || 0.3;
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.ellipse(0, this.height * this.scale * 0.4 + this._shadowOffset, this._shadowWidth * this.scale, this._shadowWidth * this.scale * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        if (this.mirror)
            ctx.scale(-1, 1);

        // const currentFrame = (Math.floor((TimeHandler.totGameTime - this.spawnTime) / 1000 * this.speed) % this.frames) + this.framesOffset;
        const currentFrame = this.getCurrentFrame();

        const x = -this.width * this.scale / 2;
        let y = -this.height * this.scale / 2;

        // if (this._shadowWidth)
        // ctx.fillRect(x + (this.width * 1.5) * (1 - this._shadowWidth), y + this.height * 1.8, (this.width * 1.5) * this._shadowWidth, 8);

        if (this._waveHeight) {

            y -= this._waveHeight * Math.cos(((Date.now() - this.spawnTime) / (1000 * this._waveSpeed)));
        }

        // ctx.drawImage(this.img, this.width * currentFrame + this.startOffset.x, this.startOffset.y, this.width, this.height,
        // x, y, this.width * this.scale, this.height * this.scale)

        this.drawFrame(ctx, currentFrame, new Vector2(x, y));

        ctx.restore();
    }

    drawFrame(ctx, frame, pos) {

        ctx.drawImage(this.img, this.width * frame + this.startOffset.x, this.startOffset.y, this.width, this.height,
            pos.x, pos.y, this.width * this.scale, this.height * this.scale)
    }

    getCurrentFrame() {
        return (Math.floor((TimeHandler.totGameTime - this.spawnTime) / 1000 * this.speed) % this.frames) + this.framesOffset;

    }
}