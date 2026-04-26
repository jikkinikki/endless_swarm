export default class Timer {

    constructor() {

        this._time = 0;
        this._totTime = 0;

        this._running = false;
    }

    start() {

        this._time = performance.now();
        this._running = true;
    }

    pause() {

        if (!this._running) return;

        this._totTime += performance.now() - this._time;
        this._running = false;
    }

    reset() {

        if (this._running) this.pause();

        const totTime = this._totTime;
        this._totTime = 0;
        this._time = 0;
        this._running = false;

        return totTime;
    }

    get totTime() {

        if (this._running) {

            this.pause();
            this.start();
        }

        return this._totTime;
    }

}
