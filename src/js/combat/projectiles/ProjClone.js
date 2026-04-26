import Projectile from "../weapons/Projectile";

export default class ProjClone extends Projectile{

    constructor(position, weapon){

        super(position, 10, 0, weapon);
    }
}