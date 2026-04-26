import Vector2 from "../Tools/Vector2";

class CameraController {

    constructor() {

        this._overrideModes = [

            "full",
            "offset",
            "none"
        ]        

        this._overrideMode = "none";
        this._adjustment = new Vector2(0, 0);
    }

    setAdjustment(adjustment) {

        this._adjustment = adjustment;
    }

    getAdjustment(pos) {

        switch (this._overrideMode) {

            case "offset":
                return pos.add(this._adjustment);

            case "full":
                return this._adjustment.clone();

            case "none":
                return pos;
        }
        
    }

    setOverrideMode(mode) {

        if (!this._overrideModes.includes(mode))
            throw new Error("Invalid override mode");

        this._overrideMode = mode;
    }

    reset(){

        this._overrideMode = "none";
        this._adjustment = new Vector2(0, 0);
    }
}

export default new CameraController();