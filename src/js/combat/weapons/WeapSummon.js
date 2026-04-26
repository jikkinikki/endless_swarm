import Ent from "../../entities/Ent";
import Handler from "../../engine/handlers/Handler";
import TimeHandler from "../../engine/handlers/TimeHandler";
import Weapon from "./Weapon";

export default class WeapSummon extends Weapon {
    
    /**
    * @param {Ent} entity
    */
    constructor(owner, entity, team, reloadTime = 10000, passive = false) {
        
        super("The Summoner", "Summon yourself a follower.");
    
        this.reloadTime = reloadTime;
        this._lastReload = - this.reloadTime;
        this._team = team;
        this._entity = entity;
        this.pickup(owner);
        this._passive = passive;
    }

    tick(){

        if(this._passive)
            this.fire();
    }

    fire(){

        if(!this.readyToFire())
            return;

        this._lastReload = TimeHandler.totGameTime;

        this.summon();
    }

    summon(){

        const newEnt = new this._entity(this.owner.position.clone(), this.owner);
        Handler.addObj(newEnt, [this._team]);
    }

}