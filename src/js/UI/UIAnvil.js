import Player from "../entities/players/Player";
import Handler from "../engine/handlers/Handler";
import Inventory from "../Inventory";
import ItemCoin from "../items/ItemCoin";
import ItemScrap from "../items/ItemScrap";
import Vector2 from "../engine/Tools/Vector2";
import Weapon from "../combat/weapons/Weapon";
import UIElem from "./UIElem";

export default class UIAnvil extends UIElem {

    constructor() {

        super(new Vector2(0, 0), new Vector2(200, 200), "anvil-UI");

        this.addListener();
        // this.openMenu();
        this.closeMenu();
    }

    addListener() {

        this._elem.querySelector("[tag=close]").addEventListener("click", () => {

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

        let weaponSlots = this._elem.querySelectorAll("[tag=buy-weapon]");

        this.setBuyWeapons(player);
        this.setWeaponUgrades(player);
    }

    /**
     * 
     * @param {Player} player 
     */
    setBuyWeapons(player) {

        let weaponSlots = this._elem.querySelectorAll("[tag=buy-weapon]");

        for (let i = 0; i < 3; i++) {

            /**@type {Weapon}*/
            const weapon = i >= player.randomBuyableWeapons.length ? null : player.randomBuyableWeapons[i];

            const nameElem = weaponSlots[i].querySelector("[tag=name]");
            const descElem = weaponSlots[i].querySelector("[tag=desc]");
            let buyBtnElem = weaponSlots[i].querySelector("[tag=buy-btn]");
            buyBtnElem = this.resetBtn(buyBtnElem);

            if (weapon != null) {

                nameElem.innerHTML = weapon.name;
                descElem.innerHTML = weapon.desc;

                if (weapon._statData._shop_data) {
                    buyBtnElem.innerHTML = weapon._statData._shop_data[0].cost[0].amount + " coins";

                    buyBtnElem.addEventListener("click", () => {

                        /**@type {Inventory}*/
                        const inventory = player.inventory;

                        if (inventory.tryRemoveItem(new ItemCoin(), weapon._statData._shop_data[0].cost[0].amount)) {

                            console.log("buying weapon");
                            player.addWeapon(weapon);
                            player.randomizeNextBuy();
                            this.openMenu();
                        }
                        else
                            console.log("not enough for payment!");
                    });
                }
                else
                    buyBtnElem.innerHTML = ".";


            }
            else {

                nameElem.innerHTML = "";
                descElem.innerHTML = "";
                buyBtnElem.innerHTML = "";
            }
        }
    }

    setWeaponUgrades(player) {

        let upgradeSlots = this._elem.querySelectorAll("[tag=upgr-weapon]");


        for (let i = 0; i < 5; i++) {

            /**@type {Weapon}*/
            const weapon = i >= player.weapons.length ? null : player.weapons[i];
            const nameElem = upgradeSlots[i].querySelector("[tag=name]");
            const descElem = upgradeSlots[i].querySelector("[tag=desc]");
            let buyBtnElem = upgradeSlots[i].querySelector("[tag=buy-btn]");
            buyBtnElem = this.resetBtn(buyBtnElem);

            if (weapon != null) {

                const weaponData = weapon.getNextLevelInfo();


                if (weapon.isMaxLevel()) {

                    nameElem.innerHTML = weapon.name;
                    descElem.innerHTML = "max level";
                    buyBtnElem.innerHTML = "max level";

                } else {

                    nameElem.innerHTML = weapon.name + " lvl: " + (weapon._lvl + 1);

                    if (weaponData != null) {

                        descElem.innerHTML = weaponData.desc;
                        buyBtnElem.innerHTML = + weaponData.cost[0].amount + " scrap";
                        buyBtnElem.addEventListener("click", () => {

                            /**@type {Inventory}*/
                            const inventory = player.inventory;

                            if (inventory.tryRemoveItem(new ItemScrap(), weaponData.cost[0].amount)) {

                                console.log("upgrading");
                                weapon.setLevel(weapon._lvl + 1);
                                this.openMenu();
                            }
                            else
                                console.log("not enough for payment!");
                        });
                    }
                }
            }
            else {

                nameElem.innerHTML = "";
                descElem.innerHTML = "";
                buyBtnElem.innerHTML = ".";
            }
        }
    }

    resetBtn(button) {

        const newButton = button.cloneNode(true); 
        button.parentNode.replaceChild(newButton, button);
    
        return newButton
    }

}