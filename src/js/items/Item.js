import Animation from "../engine/Animation/Animation";

export default class Item{

    constructor(type, anim){

        this._type = type;

        /**
         * @type {Animation} 
         */
        this._anim = anim;
    }

    render(ctx){

        
    }
}