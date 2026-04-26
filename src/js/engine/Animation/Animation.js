import { Handler } from "../../imports.js";
import PixiHandler from "../handlers/PixiHandler.js";
import Renderer from "../handlers/Renderer.js";
import TimeHandler from "../handlers/TimeHandler.js";
import Vector2 from "../Tools/Vector2.js";
import { Sprite, Texture, Rectangle, Graphics, Assets } from "pixi.js";

export default class Animation {
    constructor(path, frames, speed, totalFrames) {
        this.path = path;
        this.frames = frames;                 // number of frames to animate through
        this.speed = speed;                   // frames per second (logical)
        this.totalFrames = totalFrames || frames; // total frames laid out in the spritesheet row

        this.currentFrame = 0;
        this.spawnTime = TimeHandler.totGameTime;
        this.mirror = false;
        this.ready = false;

        this.scale = 2;
        this._rotationOffset = 0;
        this._waveSpeed = 0;
        this._waveHeight = 0;
        this._shadowWidth = 0;

        this.startOffset = new Vector2(0, 0); // pixel offset inside the sheet
        this.framesOffset = 0;                // frame-index offset inside the sheet
        this.spinSpeed = 0;
        this.spinOffset = 1;
        this._forceSize = false;

        this.textures = [];   // will hold ALL totalFrames slices to support framesOffset at runtime
        this.sprite = null;
        this.shadow = null;
        this._layer = null;
        this._texturePath = path;

        this._loadTexture(path);
    }

    async _loadTexture(path) {
        try {
            // In v8, Assets.load returns a Texture
            const fullTexture = await Assets.load(path);
            // fullTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
            fullTexture.baseTexture.scaleMode = "nearest";

            // Use Texture dimensions (no frame => full image size)
            const sheetWidth = fullTexture.width;
            const sheetHeight = fullTexture.height;

            // Derive per-frame size unless explicitly forced
            this.width = this._forceSize ? this.width : sheetWidth / this.totalFrames;
            this.height = this._forceSize ? this.height : sheetHeight;

            const source = fullTexture.source; // v8 replacement for baseTexture

            // Slice ALL frames in the row so we can apply framesOffset dynamically
            this.textures.length = 0;
            for (let i = 0; i < this.totalFrames; i++) {
                const frameRect = new Rectangle(
                    (i * this.width) + this.startOffset._x,
                    this.startOffset._y,
                    this.width,
                    this.height
                );
                this.textures.push(new Texture({ source, frame: frameRect }));
            }

            // Create sprite with the first frame (using offset too)
            this.sprite = new Sprite(this.textures[0]);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);

            // Add to layer once we have a valid sprite
            // console.log("layer:", this._layer);
            if (this._layer) {

                PixiHandler.addSprite(this.sprite, this._layer);
            }

            //remove shadow width
            this._shadowWidth = null;
            // Optional shadow Graphics (v8 chainable API)
            if (this._shadowWidth) {
                this.shadow = new Graphics();
                PixiHandler.addSprite(this.shadow, "shadows"); // make sure "shadows" layer exists
            }

            this.ready = true;
        } catch (err) {
            console.error("Failed to load animation texture:", path, err);
        }
    }

    // ---------- settings ----------
    setWave(speed, height) { this._waveSpeed = speed; this._waveHeight = height; return this; }
    setRotationOffset(rotation) { this._rotationOffset = rotation; return this; }
    deltaRotation(delta) { this._rotationOffset += delta; return this; }
    setShadow(width, offset = 0, opacity = 0.3) { this._shadowWidth = width; this._shadowOffset = offset; this._shadowOpacity = opacity; return this; }
    setSize(w, h) { this._forceSize = true; this.width = w; this.height = h; return this; }
    
    setStartOffset(offset) { this.startOffset = offset; return this; }
    
    faceDirection(dir) { const d = Math.abs(dir); this.mirror = (Math.PI * 0.5 < d && d < Math.PI * 1.5); return this; }
    
    setSpin(speed, offset) {
        this.spinSpeed = speed;
        this.spinOffset = offset || 1;
        return this;
    }

    setFramesOffset(offset) { this.framesOffset = offset; return this; }

    setVisible(visible) { this.sprite.visible = visible }

    // ---------- animation logic ----------
    _localFrameIndex() {
        // 0..frames-1 cycles based on time
        return Math.floor((TimeHandler.totGameTime - this.spawnTime) / 1000 * this.speed) % this.frames;
    }

    _sheetFrameIndex() {
        // Map local frame into the spritesheet's totalFrames using framesOffset
        return (this.framesOffset + this._localFrameIndex()) % this.totalFrames;
    }

    render(_, position) {

        if (position == null)
            console.log("error pos");


        if (!this.ready || !this.sprite) return;

        // Camera offset (keep your existing camera + Renderer.canvas contracts)
        const cameraCenter = Handler.getCameraCenter().round();
        const screenX = position._x - cameraCenter.x + Renderer.canvas.width / 2;
        let screenY = position._y - cameraCenter.y + Renderer.canvas.height / 2;

        // Wave (bob) motion
        if (this._waveHeight) {
            screenY -= this._waveHeight * Math.cos((Date.now() - this.spawnTime) / (1000 * this._waveSpeed));
        }

        // Position sprite
        this.sprite.position.set(screenX, screenY);

        // Rotation
        if (this.spinSpeed != 0)
            this.sprite.rotation = (TimeHandler.totGameTime / 1000 * this.spinSpeed) + this._rotationOffset;

        // Mirror + scale
        if (!this._lastMirror || this._lastMirror != this.mirror || !this._lastScale || this._lastScale != this.scale) {
            this._lastMirror = this.mirror;
            this._lastScale = this.scale;
            this.sprite.scale.set(this.scale * (this.mirror ? -1 : 1), this.scale);
        }

        // Select correct subtexture (cropped frame) from the spritesheet
        const texIndex = this._sheetFrameIndex();
        this.sprite.texture = this.textures[texIndex];

        // Shadow (v8 Graphics API)
        if (this.shadow) {
            const ry = this._shadowWidth * this.scale * 0.3;
            const rx = this._shadowWidth * this.scale;
            const sy = this.sprite.y + (this.height * this.scale * 0.4) + (this._shadowOffset || 0);

            this.shadow.clear()
                .ellipse(this.sprite.x, sy, rx, ry)
                .fill({ color: 0x000000, alpha: this._shadowOpacity ?? 0.3 });
        }
    }

    clone() {

        const clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this)

        clone._loadTexture(this._texturePath);

        return clone;
    }
}
