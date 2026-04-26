import { Container, Graphics, Particle, ParticleContainer, RenderTexture, Sprite, WebGLRenderer, WebGPURenderer } from 'pixi.js';
// import { TexturePool } from "pixi.js";
class PixiHandler {

    constructor() {

        this.isReady = false;
        this._layers = new Map();
        this.setup();

        this._bufferedLayers = [];
        this._bufferedSprites = [];

        this.max_debug = 0;
    }

    async setup() {

        const settings = {
            canvas: document.getElementsByTagName("canvas")[0],
            width: window.innerWidth,
            height: window.innerHeight,
            // powerPreference: "high-performance",
        };

        this.renderer = new WebGLRenderer();
        // this.renderer = new WebGPURenderer();
        await this.renderer.init(settings);

        this.stage = new Container();
        this.stage.sortableChildren = true;
        this.isReady = true;

        // const bufferedLayers = [...this._bufferedLayers];

        let layer;
        while (this._bufferedLayers.length > 0) {
            layer = this._bufferedLayers.pop();
            this.addLayer(layer.layerName, layer.zIndex, true);
        }

        let sprite;
        while (this._bufferedSprites.length > 0) {
            sprite = this._bufferedSprites.pop();
            this.addSprite(sprite.sprite, sprite.layerName, true);
        }

        let particleLayer = new ParticleContainer(
            {
                dynamicProperties: {
                    position: true,
                    rotation: false,
                    scale: false,
                    color: false,
                }
            }
        );
        particleLayer.zIndex = 100;

        this._layers.set("particles", { container: particleLayer, zIndex: 100 });
        this.stage.addChild(particleLayer);

        this.stage.sortChildren();

        // const squareSprite = this.createSquareTexture();
        // this.addParticle(squareSprite);

        console.log("PixiHandler ready");
    }

    createSquareSprite(sizeX = 5, sizeY = 5, color = 0xffffff) {
        // 1. Create a Graphics object
        // const g = new Graphics()
        //     .beginFill(color)
        //     .drawRect(0, 0, sizeX, sizeY)
        //     .endFill();

        // // 2. Convert Graphics to a RenderTexture (v8)
        // const texture = RenderTexture.from(g);

        // // 3. Create a Sprite from the texture
        // const sprite = new Sprite(texture);

        // return sprite;
    }

    addParticle(particle) {

        if (this.isReady) {

            this._layers.get("particles").container.addParticle(particle);
            this._layers.get("particles").container.update();
        }
    }

    removeParticle(sprite) {

        if (this.isReady) {

            const layerName = "particles";

            let layer = this._layers.get(layerName);

            if (layer) {
                layer.container.removeParticle(sprite);
            }
            else {
                console.warn("Layer not found:", layerName);
            }
        }

    }

    addLayer(layerName, zIndex, force = false) {

        if (this._layers.has(layerName))
            console.warn("Layer already exists:", layerName, "overwriting! Remove the old layer first.");

        if (!this.isReady && !force) {
            this._bufferedLayers.push({ layerName, zIndex });
            return;
        }

        console.log("adding layer", layerName, zIndex);

        this._layers.set(layerName, { container: new Container(), zIndex: zIndex });

        let layer = this._layers.get(layerName);
        layer.container.zIndex = zIndex;

        this.stage.addChild(layer.container);

        this.stage.sortChildren();
    }

    addSprite(sprite, layerName, force = false) {

        // console.log("adding sprite to layer: ", layerName);
        // if(layerName == "map")
        // return;

        this.max_debug++;
        // if(this.max_debug > 10)
        // return;
        if (this.isReady || force) {

            this._layers.get(layerName).container.addChild(sprite);
            // console.log("added sprite", sprite, layerName);
        }
        else {
            this._bufferedSprites.push({ sprite, layerName });
            
            console.log("adding to buffer");
            
        }
    }

    //TODO: fix this to update buffer in not loaded.
    removeSprite(sprite, layerName = "") {

        if (this.isReady) {

            if (layerName != "") {
                let layer = this._layers.get(layerName);
                if (layer) {
                    layer.container.removeChild(sprite);
                }
                else {
                    console.warn("Layer not found:", layerName);
                }
            }
            else {
                for (const layer of this._layers.values()) {
                    layer.container.removeChild(sprite);
                }
            }
        }
        else {

            console.trace("removing from buffer");
            console.log(sprite, this._bufferedSprites.length < 1 ? "no sprites" : this._bufferedSprites[0].sprite, layerName);
            

            for (let i = 0; i < this._bufferedSprites.length; i++) {
                const item = this._bufferedSprites[i];

                if (item.sprite == sprite && (layerName == "" || item.layerName == layerName)) {
                    this._bufferedSprites.splice(i, 1);
                    // break;
                    console.log("-----------------------");
                    return;
                }
            }

            console.log("failed to remove from buffer");
            console.log("-----------------------");
            
        }
    }

    render() {

        if (!this.isReady) return;

        this.renderer.render(this.stage);
    }
}


export default new PixiHandler();