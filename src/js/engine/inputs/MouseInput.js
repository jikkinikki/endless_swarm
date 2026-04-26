import HandlerBase from "../handlers/HandlerBase";
import Vector2 from "../Tools/Vector2";

class MouseInput extends HandlerBase{

    constructor() {

        super();
        this._mousePos = new Vector2(0, 0);
        this._mouseDown = false;
        this._mouseData = [false, false, false];
        this._scroll = 0;
        this._bufferScrolls = [];

        this.setupListners();
    }

    setupListners() {

        document.addEventListener("mousemove", (e) => {

            this._mousePos = new Vector2(e.clientX, e.clientY);
        });

        document.addEventListener("mousedown", (e) => {

            this._mouseData[e.button] = true;
            this._mouseDown = true;
        });

        document.addEventListener("mouseup", (e) => {

            this._mouseData[e.button] = false;
            this._mouseDown = false;

        });

        document.addEventListener("wheel", (e) => {

            this._bufferScrolls.push(e.deltaY);

        });

        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
    }

    getIsDown(button) {

        return this._mouseData[button];
    }

    get mousePos() {

        return this._mousePos.clone();
    }

    tick() {

        this._scroll = 0;

        for (const scroll of this._bufferScrolls) {

            this._scroll += scroll;
        }
        this._bufferScrolls = [];
    }

    onAdd() {}

    render(ctx) { }
}

export default new MouseInput();