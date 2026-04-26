import { Handler } from "../imports.js";
import UIElem from "./UIElem.js";
import Random from "../engine/Tools/Random.js";
import SDEnt from "../statData/SDEnt.js";

export default class UILevelUp extends UIElem {

    constructor(pos, size) {
        super(pos, size, "level-up-UI");

        // this.openMenu();
        this.addListener();
    }

    addListener() {

        this._elem.querySelector("[tag=close]").addEventListener("click", () => {

            console.log("close");

            this.closeMenu();
        });
    }

    closeMenu() {

        this._elem.classList.add("hidden");
        Handler.paused = false;
    }

    openMenu() {

        this._elem.classList.remove("hidden");
        Handler.paused = true;

        /**
         * @type {Player}
         */
        let player = Handler.getPlayers()[0];

        let weaponSlots = this._elem.querySelectorAll("[tag=lvl-opt]");

        let statData = new SDEnt("");
        let some3RandomStats = Random.fromArray(statData.getStatTypes(), 3, false);

        for (let i = 0; i < weaponSlots.length; i++) {

            let stat = some3RandomStats[i];

            let statBonus = statData.getStatBonus(stat);

            let statName = stat;
            let statDesc = `Current: ${statBonus}`;

            weaponSlots[i].querySelector("[tag=name]").textContent = statName;
            weaponSlots[i].querySelector("[tag=desc]").textContent = statDesc;
            weaponSlots[i].querySelector("[tag=buy-btn]").textContent = `+ ${10}`;

            weaponSlots[i].querySelector("[tag=buy-btn]").addEventListener("click", () => {

                console.log("buy");
                this.closeMenu();
            });
        }
    }

}