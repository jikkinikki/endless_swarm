import Pickup from "./Pickup";
import hpAnim from "./../../textures/hp.png"
import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";

export default class PickupHp extends Pickup{

    constructor(position){

        super(position)
        this.hp = 10;

        this.anim = new Animation(hpAnim, 4, Renderer.speed);
    }
    
    onPickup(picker){

        picker.deltaHp(this.hp);
    }
}