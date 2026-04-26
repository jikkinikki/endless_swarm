import Handler from "../engine/handlers/Handler";
import Vector2 from "../engine/Tools/Vector2";
import UIText from "./UIText";

export default class UIPaused extends UIText{

    constructor(position, size){
        super(position, size, "");
        this.setFont("100px Arial");
        this.setFillColor("lightgray");
        this.setTextAlign("center");

    }

    tick(){

        this.setText(Handler.paused ? "Paused" : "");
    }
}