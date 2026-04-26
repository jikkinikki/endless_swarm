import TimeHandler from "./engine/handlers/TimeHandler";
import Vector2 from "./engine/Tools/Vector2";

export default class LightSource {

    constructor(owner, strength, color) {

        this._owner = owner;
        this._strength = strength;
        this._color = color;
    
        this.newRandomOffset();
    }
    
    newRandomOffset() {
        
        this._randomOffset = new Vector2(Math.random() * 10, Math.random() * 10);
        this._lastOffsetUpdate = TimeHandler._totGameTime;
    }

    setPos(pos) {

        this._pos = pos;
        return this;
    }

    get randomOffset() {

        // if(TimeHandler._totGameTime - this._lastOffsetUpdate > 200)
            // this.newRandomOffset();

        return this._randomOffset;
    }

    get position() {

        if(this._pos)
            return this._pos;

        if(this._owner.getFeetPos)
            return this._owner.getFeetPos(false).addxy(this.randomOffset.x, this.randomOffset.y);

        return this._owner.position;
    }
}

