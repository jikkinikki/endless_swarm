import Pickup from './Pickup.js';
import coinAnim from './../../textures/pickups/coin.png';
import Renderer from '../engine/handlers/Renderer.js';
import Animation from '../engine/Animation/Animation.js';
import ItemCoin from '../items/ItemCoin.js';

export default class PickupCoin extends Pickup{
    constructor(position){
        super(position)
        this.anim = new Animation(coinAnim, 4, Renderer.speed);
    }

    getItem(){
        return new ItemCoin(this.anim);
    }

    onPickup(picker){
        // picker.deltaCoins(1);
        picker.inventory.addItem(new ItemCoin(this.anim), 1);
    }
}