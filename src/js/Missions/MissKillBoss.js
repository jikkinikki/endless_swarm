import EntGooper from "../entities/EntGooper";
import Handler from "../engine/handlers/Handler";
import Vector2 from "../engine/Tools/Vector2";
import WeapBoomo from "../combat/weapons/WeapBoomo";
// import WeaponsList from "../combat/weapons/WeaponsList";
import Mission from "./Mission";

export default class MissKillBoss extends Mission {

    constructor() {
        super(-1, 1);
    }

    onMissionStart() {

        super.onMissionStart();
        this.enemy = new EntGooper(Handler.getCameraCenter());
        this.enemy.weapons[0].dmg *= 3;
        this.enemy._hp += -1;
        Handler.addObj(this.enemy, ["mission", "team2"]);
    }

    checkIfCompleted() {

        if (this.enemy.isDead)
            return true;

        return false;
    }

    onSuccessful() {

        super.onSuccessful();

        // const obj = WeaponsList(WeapBoomo, "item").setPosition(100, 100);
        
        Handler.addObj(obj, ["pickups"]);

        console.log("yay2");
    }

}