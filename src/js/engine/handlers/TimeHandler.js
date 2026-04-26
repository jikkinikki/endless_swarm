import HandlerBase from "./HandlerBase";

class TimeHandler extends HandlerBase {

    constructor() {

        super();

        this._totGameTime = 0 * 1000;
        this._timeScale = 1;
        // this._totGameTime = 319 * 1000;
        this._deltaTime = 0;
        this._lastTime = Date.now();
        this.wasPaused = false;

    }

    get totGameTime() {

        return this._totGameTime;
    }

    get deltaTime() {

        return this._deltaTime;
    }

    get deltaTimeSecs(){

        return this._deltaTime / 1000;
    }

    tick() {

        const currentTime = Date.now() * this._timeScale;

        if (this.wasPaused) {

            this._lastTime = currentTime;
            this.wasPaused = false;
        }
        this._deltaTime = currentTime - this._lastTime;
        this._totGameTime += this._deltaTime;

        this._lastTime = currentTime;
    }

    render(ctx) {

    }

    getTimeText(){

        const time = this.totGameTime / 1000;
        return Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + Math.floor(time % 60);
    }

    reset(){

        this._totGameTime = 0;
        this._deltaTime = 0;
        this._lastTime = Date.now();
        this.wasPaused = false;
    }
}

export default new TimeHandler();