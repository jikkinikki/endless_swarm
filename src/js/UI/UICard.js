import UI from "./UI";

export default class UICard extends UI {

    constructor(position, size, header, description) {
        super(position, size)

        this.header = header || "Header";
        this.description = description || "Description";
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // ctx.save();

        // ctx.fillStyle = "green";
        // ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // ctx.strokeStyle = "black";
        // ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // ctx.fillStyle = "black";
        // ctx.font = "30px Arial";

        // // Write text in the center of the card
        // ctx.fillText(this.header, this.position.x + this.size.x / 2 - ctx.measureText(this.header).width / 2, this.position.y + 30);

        // ctx.font = "20px Arial";
        // // Write text in the center of the card. Use word wrapping. use margin as well
        // const margin = 10;
        // const words = this.description.split(" ");
        // let line = "";
        // let lines = [];
        // for (const word of words) {

        //     if (ctx.measureText(line + word).width < this.size.x - margin * 2) {

        //         line += word + " ";
        //     } else {

        //         lines.push(line);
        //         line = word + " ";
        //     }
        // }
        // lines.push(line);

        // for (let i = 0; i < lines.length; i++) {

        //     ctx.fillText(lines[i], this.position.x + margin, this.position.y + 70 + i * 20);
        // }

        // if (this.mouseOver) {

        //     ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        //     ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        // }

        // ctx.restore();
    }

    onClick() {

        console.log("clicked card:", this.card);
    }
}