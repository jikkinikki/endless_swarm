/**
 * Controls ease to move between multiple animations for a single object
 */

import PixiHandler from "../handlers/PixiHandler";
import Animation from "./Animation";


export default class Animator {

    constructor() {

        this.anims = {

        }

        /** @type {Animation} */
        this.loadedAnim = undefined;
        this.speedMod = 1;
    }

    /**
    * @param {Object<string, Animation>} newAnims
    * @returns {Animator}
    */
    addAnims(newAnims) {

        Object.assign(this.anims, newAnims);
        return this;
    }

    loadAnim(animName) {

        if (Object.keys(this.anims).includes(animName)) {

            if (this.loadedAnim && this.loadedAnim.sprite)
                this.loadedAnim.sprite.visible = false;

            this.loadedAnim = this.anims[animName]

            if (!this.loadedAnim._layer) {

                console.log(this._layer);

                this.loadedAnim._layer = this._layer;

                if (this.loadedAnim.sprite)
                    PixiHandler.addSprite(this.loadedAnim.sprite, this._layer);
                else
                    console.log("no sprite found");
            }

            if (this.loadedAnim.sprite)
                this.loadedAnim.sprite.visible = true;
        }
        else
            console.log("missing animation! Name:", animName, "existing:", Object.keys(this.anims));
    }

    unloadActiveAnim() {

        if (this.loadedAnim && this.loadedAnim.sprite) {

            this.loadedAnim.sprite.visible = false;
        }
    }

    getAnim(animName) {

        if (Object.keys(this.anims).includes(animName)) {

            return this.anims[animName]
        }
        else
            console.log("missing animation! Name:", animName, "existing:", Object.keys(this.anims));

    }

    getActiveAnim() {

        return this.loadedAnim;
    }

    faceDirection(dir) {

        for (const anim in this.anims)
            this.anims[anim].faceDirection(dir);
    }

    render(ctx, position) {

        if (this.loadedAnim)
            this.loadedAnim.render(ctx, position);
    }

    onRemove() {

        if (this.loadedAnim)
            this.unloadActiveAnim();

        for (const animKey in this.anims) {

            const anim = this.anims[animKey];

            if (anim.sprite) {

                console.log("removing sprite", anim.sprite, anim._layer);

                PixiHandler.removeSprite(anim.sprite, anim._layer);
            }

        }
    }
}