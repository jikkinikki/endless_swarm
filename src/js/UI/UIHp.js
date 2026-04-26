import Vector2 from '../engine/Tools/Vector2.js';
import UIElem from './UIElem.js';
import heartImg from '../../textures/other/heart.png';
import heartImg1 from '../../textures/UI/hearts/heart1.png';
import heartImg2 from '../../textures/UI/hearts/heart2.png';
import heartImg3 from '../../textures/UI/hearts/heart3.png';
import heartImg4 from '../../textures/UI/hearts/heart4.png';
import Handler from '../engine/handlers/Handler.js';
import Validator from '../engine/debug/Validator.js';
import Player from '../entities/players/Player.js';

export default class UIHp extends UIElem {
    constructor() {

        super(new Vector2(0, 0), new Vector2(0, 0), "player-hp-div");

        this._heartImgs = [
            heartImg1,
            heartImg2,
            heartImg3,
            heartImg4
        ];

        this._lastHp = -1;

        this.setHp(1);

        // let temp = 1;

        // setInterval(() => {
        //     this.setHp(temp);
        //     temp -= 0.01;
        // }, 100);
    }

    setHp(hp01) {

        if (this._lastHp == hp01) return;
        this._lastHp = hp01;

        Validator.validate(hp01, Number);

        this._elem.innerHTML = "";

        hp01 = this.clamp(hp01, 0, 1);

        const totSteps = 10 * 4

        for (let i = 0; i < 10; i++) {

            const min = i * 4 / totSteps;
            const start = this.round(hp01 - min, 3);
            const fullness = this.clamp(start, 0, 1 / totSteps * 4);
            const converted = Math.floor(fullness * 3 * 10);

            this.addHeartElem(3 - converted);
        }
    }

    round(val, decimals) {

        return val.toFixed(decimals);
    }

    clamp(val, min, max) {
        return Math.max(min, Math.min(val, max));
    }

    addHeartElem(index) {

        const img = document.createElement("img");
        img.src = this._heartImgs[index];
        this._elem.appendChild(img);
    }

    tick() {

        super.tick();

        if (this._player || this._tryLoadPlayer())            
            this.setHp(this._player._statData.hp / this._player._statData.maxHp);
    }

    render(ctx) {

        super.render(ctx);
    }

    _tryLoadPlayer() {

        const player = Handler.getPlayers()[0];

        if (player) {

            /** @type {Player} */
            this._player = player;
            return true;
        }
        return false;
    }
}