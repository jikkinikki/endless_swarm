// import Validator from "./Validator";

export default class Vector2 {
    constructor(x, y) {

        this._x = x;
        this._y = y;

        this._debugOn = false;
    }

    set x(newX) {

        this._x = newX;
    }

    set y(newY) {

        this._y = newY;
    }

    get x() {

        return this._x;
    }

    get y() {

        return this._y;
    }

    getDistXY(x, y) {

        return Math.sqrt(Math.pow(this._x - x, 2) + Math.pow(this._y - y, 2));
    }

    setxy(x, y) {

        this._x = x;
        this._y = y;

        return this;
    }

    clone() {

        return new Vector2(this._x, this._y);
    }

    equals(other) {
        return this._x == other._x && this._y == other._y;
    }

    round() {

        this._x = Math.round(this._x);
        this._y = Math.round(this._y);

        return this;
    }

    floor() {

        this._x = Math.floor(this._x);
        this._y = Math.floor(this._y);

        return this;
    }

    ceil() {

        this._x = Math.ceil(this._x);
        this._y = Math.ceil(this._y);

        return this;
    }

    moveInDir(dir, speed) {

        if (typeof dir != "number") {

            dir = this.getDir(dir);
        }

        this._x += Math.cos(dir) * speed;
        this._y += Math.sin(dir) * speed;

        if (this._debugOn)
            this.validateSelf(true);

        return this;
    }

    scale(scaler) {
        this._x *= scaler;
        this._y *= scaler;

        if (this._debugOn)
            this.validateSelf(true, `scaler ${scaler}`);

        return this;
    }

    getDir(otherVector) {

        return Math.atan2(- this._y + otherVector._y, - this._x + otherVector._x);
    }

    getAngle(){

        return Math.atan2(this._y, this._x);
    }

    normalize() {

        const length = this.getDist(Vector2_zero);

        this._x /= length;
        this._y /= length;
    }

    getDirXY(x, y) {

        return Math.atan2(- this._y + y, - this._x + x);
    }

    getDist(otherVect) {

        // console.log(otherVect);
        return Math.sqrt(Math.pow(this._x - otherVect._x, 2) + Math.pow(this._y - otherVect._y, 2));
    }

    getDistXY(x, y) {

        // console.log(otherVect);
        // return Math.sqrt(Math.pow(this._x - otherVect._x, 2) + Math.pow(this._y - otherVect._y, 2));
        return Math.sqrt(Math.pow(this._x - x, 2) + Math.pow(this._y - y, 2));
    }

    addxy(x, y) {

        this._x += x;
        this._y += y;

        if (this._debugOn)
            this.validateSelf(true);

        return this;
    }

    add(other) {

        this._x += other._x;
        this._y += other._y;

        if (this._debugOn)
            this.validateSelf(true);

        return this;
    }

    validateSelf(warn, customMsg) {

        const result = Validator.validateAll([this.x, this.y], [Number, Number]);

        if (warn && !result) {
            console.warn(this.toString(), "is not a valid Vector2");

            if (customMsg)
                console.warn(customMsg);
        }
    }

    toString() {
        return `(${this._x}, ${this._y})`;
    }
}

export const Vector2_zero = new Vector2(0, 0);