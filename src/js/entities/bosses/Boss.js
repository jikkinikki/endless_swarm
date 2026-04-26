import Vector2, { Vector2_zero } from "src/js/engine/Tools/Vector2";
import Ent from "../Ent";
import TimeHandler from "src/js/engine/handlers/TimeHandler";
import { Handler } from "src/js/imports";
import UIBossBar from "src/js/UI/UIBossBar";

export default class Boss extends Ent {

    constructor(bossName) {

        //boss bar
        super(bossName, Vector2_zero);

        this._phase = 0;
        this._state = null;

        /**
         * @type {[{name: String, tickFunc: Function, weapons: import("src/js/combat/weapons/Weapon").Weapon[]}][], duration: number, phase: number}
         */
        this._states = [];
        this.addState("_transition", () => { }, [], 2, -1);

        this.currStateStartTime = -1;
        this._lastState = null;

        this._totalPhases = 0;
    }

    onAdd(){

        super.onAdd();

        Handler.getObjsByInstance(UIBossBar)[0].setBoss(this);
    }

    /**
     * 
     * @param {String} name Name of state. 
     * @param {Function} tickFunc Function to be called every tick. 
     * @param {import("src/js/combat/weapons/Weapon")[]} weapons Weapons to be used in state. Will be loaded into _weapons.
     * @param {number} duration_secs Duration of state in seconds. Converted later to milliseconds.
     * @param {number} phase Phase of state. Can only be loaded if phase matches. First phase is 0. -1 is for any phase.
     */
    addState(name, tickFunc, weapons, duration_secs, phase, override = false) {

        if(!override){

            if(this._states.find(s => s.name === name)){

                console.log("error, state already exists");
                return;
            }
        }

        this._states.push({ name, tickFunc, weapons, duration: duration_secs * 1000, phase });
    }

    /**
     * @param {String} stateName 
     */
    loadState(stateName) {

        console.log("loadState", stateName);

        const state = this._states.find(s => s.name === stateName);

        if (!state) {
            console.log("error, state missing");
            console.log(this._states);
            return;
        }

        if (state.phase != this._phase && state.phase != -1) {

            console.log("error, Cannot load state, phase mismatch", state.phase, this._phase);
            return;
        }

        this._state = state;
        this.currStateStartTime = TimeHandler._totGameTime;

        for (let r = this.weapons.length - 1; r >= 0; r--)
            this.removeWeapon(this.weapons[r]);

        for (const weapon of state.weapons) {

            this.addWeapon(weapon);
        }

        if (stateName != "_transition")
            this._lastState = stateName;

    }

    autoLoadState(mode) {

        // console.log("autoLoadState", mode);

        const modes = ["random"];

        if (!modes.includes(mode)) {
            console.log("error, invalid mode", mode);
            return;
        }

        if (this._state && this._state.name != "_transition") {

            this.loadState("_transition");
            return;
        }
        else if (mode == "random") {

            //Get states in phase
            console.log("phase", this._phase);
            
            const states = this._states.filter(s => s.phase == this._phase);

            //Get random state
            let state = states[Math.floor(Math.random() * states.length)];

            while (true) {

                if(state.name != "_transition" && (state.name != this._lastState || this._states.filter(s => s.phase == this._phase).length < 3))
                    break;

                state = states[Math.floor(Math.random() * states.length)];
            }

            this.loadState(state.name);
        }
    }

    tick() {

        if (this._state) {
            this._state.tickFunc();

            if (this.currStateStartTime != -1 && TimeHandler._totGameTime - this.currStateStartTime > this._state.duration) {

                this.autoLoadState("random");
            }
        }

        super.tick();
    }

    /**
     * 
     */
    nextPhase() {

        this._phase++;
        console.log("nextPhase", this._phase);
        
        if(this._phase >= this._totalPhases)
            console.warn("Phase index out of bounds, total phases:", this._totalPhases, "current phase:", this._phase);
    }

    simplePhaseCalc(){
        
        let hpPerc = 1 - this._statData.hp / this._statData.maxHp;
        let targetPhase = Math.floor(hpPerc * this._totalPhases);

        if(targetPhase > this._phase)
            this.nextPhase();
    }
}