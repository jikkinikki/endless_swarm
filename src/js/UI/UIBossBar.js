import Vector2 from "../engine/Tools/Vector2";
import Ent from "../entities/Ent";
import UIElem from "./UIElem";

export default class UIBossBar extends UIElem{

    constructor(){

        super(new Vector2(0, 0), new Vector2(0, 0), "boss-health-bar");
    
        this._boss = null;
        this._hpBar = this._elem.querySelector("div");

        this.setVisible(false);
    }

    /**
     * 
     * @param {Ent} boss 
     */
    setBoss(boss){

        this._boss = boss;
        this.setVisible(true);
    }
    
    tick(){

        if(this._boss){

            const perc = this._boss._statData.hp / this._boss._statData.maxHp;
            this._hpBar.style.width = `${perc * 100}%`;
        }
    }
}