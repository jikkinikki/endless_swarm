import Item from "./Item";

// import anim from "./../../textures/pickups/notes.png"
import Animation from "../engine/Animation/Animation";

export default class ItemNote extends Item{

    constructor(anim, color){

        console.log(color);

        super(`${color} note`, anim);

        this._color = color;
    }

    customInvName(){

        return this._type;
    }

    customInvLoad(anim, itemName){

        return new ItemNote(anim, itemName.split(" ")[0]);
    }
}