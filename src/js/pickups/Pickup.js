import Obj from "../engine/Tools/Obj";

export default class Pickup extends Obj{

    constructor(position){

        super(position);
    }

    getItem(){

        console.log("not implemented getItem func", this.constructor.name);
        
    }

    onPickup(picker){
        
        console.log("missing pickup func");
    }
}