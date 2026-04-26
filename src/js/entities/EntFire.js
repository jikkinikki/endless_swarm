import LightSource from "../LightSource";
import ShadowsHandler from "../engine/handlers/ShadowsHandler";
import Ent from "./Ent";

export default class EntFire extends Ent {

    constructor(position) {
        super("fire", position);

        this.lightSource = new LightSource(this, 30, "white");
        ShadowsHandler.addLightSource(this.lightSource);

    }

}