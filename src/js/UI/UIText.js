import UI from "./UI";

export default class UIText extends UI {

    constructor(position, size, text) {
        super(position, size);

        this.text = text;
        this.setTextAlign("left");
    }

    setFont(font) {

        this.font = font;
        return this;
    }

    setText(text) {

        this.text = text;

        if(this._html)
            this._html.innerText = text;
    }

    setTextAlign(mode) {

        const modes = ["left", "center", "right"];

        if (!modes.includes(mode))
            console.log("missing mode: ", mode);

        this._textAlign = mode;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // super.render(ctx);

        // if (this.font)
        //     ctx.font = this.font;

        // const offsetX = this._textAlign == "left" ? 0 : this._textAlign == "right" ? -ctx.measureText(this.text).width : -ctx.measureText(this.text).width / 2;

        // ctx.fillText(this.text, this.position._x + offsetX, this.position._y);
        // // ctx.fillRect(0, 0, 100, 100)

        // ctx.restore();
    }
}