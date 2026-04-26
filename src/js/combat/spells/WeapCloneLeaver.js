import Animator from "../../engine/Animation/Animator";
import EffKnockback from "../../effects/EffKnockback";
import EffSlowness from "../../effects/EffSlowness";
import Handler from "../../engine/handlers/Handler";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "../weapons/Weapon";
import PixiHandler from "../../engine/handlers/PixiHandler";

export default class WeapCloneLeaver extends Weapon {

    constructor(owner) {

        super();

        this.pickup(owner);

        this._lastPos = null;
    }

    tick() { }

    // render(ctx) {

    //     // if (this._lastPos != null) {

    //         /** @type {Animator} */
    //         const animator = this.owner.animator;

    //     //     ctx.save();
    //     //     ctx.globalAlpha = 0.5;
    //         animator.render(ctx, this._lastPos)

    //     //     ctx.restore();
    //     // }

    //     // this.range = 200;
    //     // this.damage = 1;
    //     // this.reloadTime = 1000;
    // }

    render(ctx) {

        if (this._lastPos != null) {

            // /** @type {Animator} */
            // const animator = this.owner.animator;

            //     ctx.save();
            //     ctx.globalAlpha = 0.5;
            // animator.render(ctx, this._lastPos)

            //     ctx.restore();

            this._anim.render(ctx, this._lastPos);
        }

        // this.range = 200;
        // this.damage = 1;
        // this.reloadTime = 1000;
    }


    fire() {

        if (this._lastPos == null) {

            if (!this.readyToFire())
                return;

            this._lastReload = TimeHandler.totGameTime;
            this._lastPos = this.owner.position.clone();

            if (!this._anim) {

                this._anim = this.owner.animator.getAnim("idle").clone();
                PixiHandler.addSprite(this._anim.sprite, this.owner.animator._layer);
            }
            else
                this._anim.setVisible(true);
        }
        else {

            this.owner.position = this._lastPos.clone();
            this._lastPos = null;

            this._anim.setVisible(false);

            this.damageNearby();
        }
    }

    damageNearby() {

        const enemies = Handler.getEnemies(this.owner);
        const closeEnemies = Handler.getClose(this, enemies, 1000);

        for (let i = 0; i < closeEnemies.length; i++) {
            const enemy = closeEnemies[i];

            if (this.owner.position.getDist(enemy.position) < this.range) {

                const effect = new EffKnockback(120, .7, Math.PI + enemy.position.getDir(this.owner.position));
                enemy.applyEffect(effect);

                enemy.applyEffect(new EffSlowness(1000, .2));
                enemy.deltaHp(-this.damage);
            }
        }
    }
}