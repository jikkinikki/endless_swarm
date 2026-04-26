import HandlerBase from "../handlers/HandlerBase";

class KeyboardInput extends HandlerBase{

    constructor() {

        super();

        this.keys = {};
        this.bufferUp = [];

        document.addEventListener("keydown", e => {

            if (!this.hasKey(e.key))
                this.setupKey(e.key)

            this.keys[e.key].down = true;
        });

        document.addEventListener("keyup", e => {

            if (!this.hasKey(e.key))
                this.setupKey(e.key)

            if (!this.bufferUp.includes(e.key))
                this.bufferUp.push(e.key);

            this.keys[e.key].down = false;

        });
    }

    setupKey(key) {

        this.keys[key] = { "down": false, "up": false };
    }

    hasKey(key) {

        return Object.keys(this.keys).includes(key);
    }

    getKeyIsDown(key) {

        return this.hasKey(key) && this.keys[key].down;
    }

    getKeyUp(key) {

        return this.hasKey(key) && this.keys[key].up;
    }

    tick() {

        for (const key of Object.keys(this.keys)) {

            if (this.keys[key].up)
                this.keys[key].up = false;
        }

        for (const key of this.bufferUp) {

            this.keys[key].up = true;
        }

        this.bufferUp = [];
    }

    onAdd() {}

    render(ctx) { }
}

export default new KeyboardInput();