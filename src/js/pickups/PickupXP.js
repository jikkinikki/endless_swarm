import Pickup from "./Pickup";
import xpAnim from "./../../textures/xp.png"
import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";

export default class PickupXP extends Pickup{

    constructor(position){
        super(position)
        this.anim = new Animation(xpAnim, 4, Renderer.speed);
    }

    onPickup(picker){
        
        // console.log("missing pickup func");
        picker.deltaXP(1);
    }
}