import PlBard from "./entities/players/PlBard";
import PlDino from "./entities/players/PlDino";
import PlDwarf from "./entities/players/PlDwarf";
import PlWizard from "./entities/players/PlWizard";

import EntBee from "./entities/EntBee";
import EntDummy from "./entities/EntDummy";
import EntGooper from "./entities/EntGooper";

import WeapBaam from "./combat/weapons/WeapBaam";
import WeapBoomo from "./combat/weapons/WeapBoomo";
import WeapBounce from "./combat/weapons/WeapBounce";
import WeapEnhialator from "./combat/weapons/WeapEnhialator";
import WeapPang from "./combat/weapons/WeapPang";
import BossSkeleton from "./entities/bosses/BossSkeleton";
import EntTank1 from "./entities/monsters/EntTank1";
import EntTank2 from "./entities/monsters/EntTank2";
import EntFast1 from "./entities/monsters/EntFast1";

class Prefabs {

    constructor() {

        this._prefabs = {};
        this._prefabByClassName = {};

        this._addPrefab("weapons", WeapBaam);
        this._addPrefab("weapons", WeapBoomo);
        this._addPrefab("weapons", WeapBounce);
        this._addPrefab("weapons", WeapEnhialator);
        this._addPrefab("weapons", WeapPang);

        this._addPrefab("playable", PlBard);
        this._addPrefab("playable", PlDino);
        this._addPrefab("playable", PlDwarf);
        this._addPrefab("playable", PlWizard);

        this._addPrefab("monsters", EntDummy);
        this._addPrefab("monsters", EntBee);
        this._addPrefab("monsters", EntGooper);
        this._addPrefab("monsters", EntTank1);
        this._addPrefab("monsters", EntTank2);
        this._addPrefab("monsters", EntFast1);

        this._addPrefab("bosses", BossSkeleton);

        console.log("prefabs loaded:", this._prefabs);
    }

    _addPrefab(tag, prefab) {
        if (this._prefabs[tag] == null) {
            this._prefabs[tag] = [prefab];
        } else {

            this._prefabs[tag].push(prefab);
        }

        this._prefabByClassName[prefab.name] = prefab;
    }

    getPrefabByClassName(className) {

        if (Object.keys(this._prefabByClassName).includes(className))
            return this._prefabByClassName[className];

        console.warn(`prefab ${className} not found`);
        return null;
    }

    getPrefabs(tag, instantiate, limit, selectMode) {

        if (this._prefabs[tag] == null) {
            console.warn("no prefabs for tag:", tag);
            return null;
        }

        if (!limit) {

            limit = this._prefabs[tag].length;
        }

        const objs = [];

        if (!selectMode) {

            const newObjs = this._prefabs[tag].slice(0, limit);

            for (let i = 0; i < newObjs.length; i++) {
                objs.push(newObjs[i]);
            }
        }
        else {

            this.validateSelectMode(selectMode);

            if (selectMode == "random") {

                for (let i = 0; i < limit; i++) {
                    let randIndex = Math.floor(Math.random() * this._prefabs[tag].length);
                    objs.push(this._prefabs[tag][randIndex]);
                }
            }
        }

        if (instantiate) {

            for (let i = 0; i < objs.length; i++) {
                objs[i] = new objs[i]();

            }

        }

        return objs;
    }

    validateSelectMode(selectMode) {

        const selectModes = [

            "random",
        ]

        if (!selectModes.includes(selectMode))
            console.warn(`selectmode ${selectMode} does not exist`)
    }
}

export default new Prefabs();