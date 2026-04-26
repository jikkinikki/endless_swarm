import Animation from "../engine/Animation/Animation";
import Handler from "../engine/handlers/Handler";
import Vector2 from "../engine/Tools/Vector2";
import UI from "./UI";

/**
 * @typedef {import('../items/Item').default} Item
 */

export default class UIInventory extends UI {

    constructor(pos, size) {

        super(pos, new Vector2(10, 10))
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {

        // ctx.save();

        // let player = Handler.getPlayers()[0];

        // // console.log(player);

        // let i = 0;
        // // console.log(player.inventory._items);

        // for (const item of player.inventory._items) {

        //     /**
        //      * @type {Animation}
        //      */
        //     let anim = item.obj._anim;

        //     // anim.render(ctx, new Vector2(100, 100 * i).add(player.position));
            
        //     // ctx.drawImage(item.obj._anim.getCurrentFrame(), 100, 100 * i);
            
        //     let spacing = 60;

        //     item.obj._anim.drawFrame(ctx, 0, new Vector2(30, 100 + spacing * i));
        //     ctx.fillStyle = "white";
        //     ctx.fillText(item.count + "x", 55, 125 + spacing * i);

        //     i++;
        // }


        // // ctx.fillStyle = "green";
        // // ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // // ctx.strokeStyle = "black";
        // // ctx.strokeRect(this.position.x, this.position.y, this.size.x, this.size.y);

        // // ctx.fillStyle = "black";
        // // ctx.font = "30px Arial";

        // // // Write text in the center of the card
        // // ctx.fillText(this.header, this.position.x + this.size.x / 2 - ctx.measureText(this.header).width / 2, this.position.y + 30);

        // // ctx.font = "20px Arial";
        // // // Write text in the center of the card. Use word wrapping. use margin as well
        // // const margin = 10;
        // // const words = this.description.split(" ");
        // // let line = "";
        // // let lines = [];
        // // for (const word of words) {

        // //     if (ctx.measureText(line + word).width < this.size.x - margin * 2) {

        // //         line += word + " ";
        // //     } else {

        // //         lines.push(line);
        // //         line = word + " ";
        // //     }
        // // }
        // // lines.push(line);

        // // for (let i = 0; i < lines.length; i++) {

        // //     ctx.fillText(lines[i], this.position.x + margin, this.position.y + 70 + i * 20);
        // // }

        // ctx.restore();
    }
}