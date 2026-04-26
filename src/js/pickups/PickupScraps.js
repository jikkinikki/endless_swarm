import Pickup from "./Pickup";
import scrapsAnim from "./../../textures/pickups/scraps.png"
import Animation from "../engine/Animation/Animation";
import Renderer from "../engine/handlers/Renderer";
import ItemScrap from "../items/ItemScrap";

export default class PickupScraps extends Pickup {

    constructor(position) {
        super(position);
        this._count = 10;
    
        this.anim = new Animation(scrapsAnim, 1, Renderer.speed).setWave(0.5, 5);
        
    }

    getItem(){

        return new ItemScrap(this.anim);
    }

    onPickup(picker) {

        if(!picker.inventory)
            console.log(picker);
            

        picker.inventory.addItem(this.getItem(), 1);
        // picker.deltaScraps(this._count);
    }
}