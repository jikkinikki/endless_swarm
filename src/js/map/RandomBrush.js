import Debug from "../engine/debug/Debug";
import Renderer from "../engine/handlers/Renderer";
import Vector2 from "../engine/Tools/Vector2";
import brush from "./Brush";

export default class RandomBrush extends brush {

    constructor(size) {

        super(size);
        // this.seedOffset = Math.random() * 1000;
    }

    /**
     * 
     * @param {Vector2} pos 
     * @returns {Vector2[]}
     */
    getAffectedTiles(pos) {

        //DOES NOT WORK FOR SOME REASON
        return;

        const positions = [];

        const rad = this.getRad();

        for (let x = 0; x < this._size; x++) {
            for (let y = 0; y < this._size; y++) {

                const tilePos = this.tileToWorldPos(new Vector2(x, y), new Vector2(pos._x - rad, pos._y - rad));
                // const tileRandX = this.getSeededRandom(pos._x + x);
                // const tileRandY = this.getSeededRandom(pos._y + y);

                // const tileRand = (tileRandX + tileRandY) / 2;

                const tileRand = this.getSeededRandom(tilePos.x);

                if (x == 0 && y == 0)
                    Debug.intervalLimPrint(tileRand + " " + tilePos.x, 20);
                // console.log(tileRand, tilePos.x);


                if (tileRand < 0.1) {
                    positions.push(tilePos);
                }
                else {
                    positions.push(this.tileToWorldPos(pos.clone(), new Vector2(0, 0)));
                }
            }
        }

        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];

            if (this.getSeededRandom(pos.x + pos.y) < 0.5) {
                positions[i] = new Vector2(1, 1);
            }
        }

        return positions;
    }

    getSeededRandom(seed) {

        return (Math.sin(seed) * 10000) % 1;
    }

    getLength() {

        return this.getAffectedTiles(new Vector2(0, 0)).length;
    }
}