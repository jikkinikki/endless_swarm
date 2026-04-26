import Vector2 from "../engine/Tools/Vector2";
import UIElem from "./UIElem";

export default class UITextElem extends UIElem {

    constructor(elemId, tickFunc) {

        super(new Vector2(0, 0), new Vector2(0, 0), elemId);
        
        this.tickFunc = tickFunc;
    }

    setText(text) {

        if(this._oldtext && this._oldtext == text) return;
        this._oldtext = text;

        this._elem.innerHTML = text;
    }

    tick(){

        if(this.tickFunc != undefined)
            this.tickFunc(this);
    }
}