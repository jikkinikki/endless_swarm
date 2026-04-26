import Animator from "src/js/engine/Animation/Animator";

import Boss from "./Boss";
import Animation from "src/js/engine/Animation/Animation";

import idle from "src/textures/bosses/skeleton/idle.png";
import Hitbox from "src/js/engine/Tools/Hitbox";
import Vector2 from "src/js/engine/Tools/Vector2";
import WeapBoomo from "src/js/combat/weapons/WeapBoomo";
import WeapBounce from "src/js/combat/weapons/WeapBounce";
import WeapCircleShooter from "src/js/combat/weapons/CircleShooter";
import Smasher from "src/js/combat/boss_weaps/Smasher";
import WeapArmSwoop from "src/js/combat/boss_weaps/WeapArmSwoop";
import TimeHandler from "src/js/engine/handlers/TimeHandler";

export default class BossSkeleton extends Boss{

    constructor(){

        super("bossSkeleton");

        this.animator = new Animator();
        this.animator.addAnims({

            "idle": new Animation(idle, 1, 1, 1)
        });

        this.animator.loadAnim("idle");

        const width = 16 * 3;
        const height = 16 * 4;
        this._feetBox = new Hitbox(new Vector2(-width / 2, -height / 2), new Vector2(width, height), this);
        this.addComponent(this._feetBox);

        this._totalPhases = 3;
    }
    
    onAdd() {
        super.onAdd();

        let phaseI = 0;

        this.addState("knifeCircleSpam_slowSping1", () => {}, [new WeapCircleShooter(0.1, 6, 2)], 4, phaseI);
        this.addState("knifeCircleSpam_slowSping2", () => {}, [new WeapCircleShooter(-0.1, 6, 2)], 4, phaseI);
        this.addState("knifeCircleSpam_slowSping3", () => {}, [new WeapCircleShooter(-0.3, 2, 2)], 4, phaseI);
        this.addState("knifeCircleSpam_slowSping3", () => {}, [new WeapCircleShooter(0.3, 2, 2)], 4, phaseI);
        
        phaseI++;
        
        // this.addState("armSwoop", () => {}, [new WeapArmSwoop()], 10, phaseI);
        this.addState("knifeCircleSpam_advanced", () => {}, [new WeapCircleShooter(Math.PI * 3.2, 6, 1)], 4, phaseI);
        // this.addState("knifeCircleSpam_advanced2", () => {}, [new WeapCircleShooter(0.1, 10, 1)], 4, phaseI);
        // this.addState("smash", () => {}, [new Smasher()], 8, phaseI);
        
        phaseI++;
        
        this.addState("armSwoop_fast", () => {}, [new WeapArmSwoop()], 10, phaseI);
        this.addState("knifeCircleSpam_crazy", () => {}, [new WeapCircleShooter(Math.PI * 0.08, 10, .8)], 4, phaseI);
        this.addState("smashFast", () => {}, [new Smasher(3, 16 * 3)], 8, phaseI);
        
        this.autoLoadState("random");
        // this.addWeapon(new WeapCircleShooter());
    } 

    tick(){
        super.tick();

        this.simplePhaseCalc();
    }
}