import Ent from "../../entities/Ent";
import Obj from "../Tools/Obj";
import { Vector2_zero } from "../Tools/Vector2";
import Vector2 from "../Tools/Vector2";
import TimeHandler from "../handlers/TimeHandler";
import KeyboardInput from "./KeyboardInput";

export default class PlayerControllerBase extends Obj{

    constructor(controllerScheme) {

        super(Vector2_zero);

        if(controllerScheme)
            this._controllerScheme = controllerScheme;
        else{

            this._controllerScheme = {

                "move_up": "w",
                "move_left": "a",
                "move_down": "s",
                "move_right": "d",
            }
        }

    }

    /**
     * @param {Ent} entity
     * @returns {PlayerControllerBase}
     */
    setEntity(entity) {

        this._entity = entity;
        return this;
    }

    tick() {

        this.move();
    }

    getInput(){

        return {

            deltaX: KeyboardInput.getKeyIsDown(this._controllerScheme.move_left) ? -1 : KeyboardInput.getKeyIsDown(this._controllerScheme.move_right) ? 1 : 0,
            deltaY: KeyboardInput.getKeyIsDown(this._controllerScheme.move_up) ? -1 : KeyboardInput.getKeyIsDown(this._controllerScheme.move_down) ? 1 : 0
        }
    }
    
    move() {

        const speed = this._entity.speed * TimeHandler.deltaTimeSecs;

        const {deltaX, deltaY} = this.getInput();

        // const dir = this.getFeetPos().getDirXY(deltaX, deltaY);

        if(deltaX != 0 || deltaY != 0){

            let dir = new Vector2(deltaX, deltaY).getAngle();

            if (!this._entity.moveInDir(dir, speed)) {

                let moved = false;

                if(deltaX != 0){

                    dir = new Vector2(deltaX, 0).getAngle();

                    moved = this._entity.moveInDir(dir, speed);
                }
                
                if (deltaY != 0 && !moved) {

                    dir = new Vector2(0, deltaY).getAngle();

                    this._entity.moveInDir(dir, speed);
                }
            }
        }

        if (deltaX != 0 || deltaY != 0) {

            if (deltaX != 0)
                this._entity.animator.faceDirection(this._entity.position.getDir(new Vector2(this._entity.position._x + deltaX, this._entity.position._y)));

            this._entity.animator.loadAnim("move");
        }
        else
            this._entity.animator.loadAnim("idle");
    }
}

