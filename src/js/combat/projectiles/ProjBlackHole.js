import Projectile from "../weapons/Projectile";
import blackHoleSprite from "../../../textures/projectiles/black_hole.png";
import Animation from "../../engine/Animation/Animation";
import Handler from "../../engine/handlers/Handler";
import TimeHandler from "../../engine/handlers/TimeHandler";

export default class ProjBlackHole extends Projectile {

    constructor(position, lifetime, weapon) {

        super(position, lifetime, 0, weapon);

        this._anim = new Animation(blackHoleSprite, 1, 1, 1);
        weapon.dmg = .1;
        weapon.range = 120;
    }

    tick() {

        super.tick();

        let enemies1 = Handler.getEnemies(this.weapon.owner);

        let enemies = Handler.getClose(this, enemies1, 1000);

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            if (this.position.getDist(enemy.position) < this.weapon.range) {

                enemy.moveInDir(enemy.position.getDir(this.position), TimeHandler.deltaTime * .07);
            }
        }
    }
}