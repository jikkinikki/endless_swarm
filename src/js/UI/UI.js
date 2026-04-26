import Obj from "../engine/Tools/Obj";
import MouseInput from "../engine/inputs/MouseInput";

export default class UI extends Obj {

    constructor(position, size) {
        super(position)

        this.size = size;
        this._mouseOver = false;
    }

    getHtmlFromId(id) {

        this._html = document.getElementById(id);

        if (this._html == undefined)
            console.log("missing id:", id);

        return this;
    }

    get mouseOver() {

        this.calcMouseOver();
        return this._mouseOver;
    }

    calcMouseOver() {

        const mousePos = MouseInput.mousePos;

        if (mousePos.x > this.position.x && mousePos.x < this.position.x + this.size.x && mousePos.y > this.position.y && mousePos.y < this.position.y + this.size.y) {

            this._mouseOver = true;
        } else {

            this._mouseOver = false;
        }
    }

    setStrokeColor(color) {

        this.strokeColor = color;
        return this;
    }

    setFillColor(color) {

        this.fillColor = color;
        return this;
    }

    tick() {

        this.calcMouseOver();
    }

    render(ctx) {

        // ctx.save();

        // if (this.fillColor)
        //     ctx.fillStyle = this.fillColor;

        // if (this.strokeColor)
        //     ctx.strokeStyle = this.strokeColor;
    }

    onClick() {


    }

    onAdd() {

    }
}