import Item from "./Item";

import anim from "./../../textures/pickups/rock.png";
import Animation from "../engine/Animation/Animation";

export default class ItemRock extends Item{

    constructor(){
        super("rock", new Animation(anim, 1, 1, 1));
    }
}