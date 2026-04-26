import Ent from "src/js/entities/Ent";
import Hitbox from "../Tools/Hitbox";
import Monster from "src/js/entities/Monster";

const { Handler } = require("src/js/imports");
const { default: HandlerBase } = require("./HandlerBase");

class OverlapHandler extends HandlerBase {

    constructor() {
        super();

    }

    onAdd() {

        this.chunkingHandler = require("src/js/engine/handlers/ChunkingHandler").default;

    }

    tick() {

        return;
        let entities = Handler.getObjsByInstance(Monster);

        let lumps = this.findLumps(entities);

        // console.log(lumps);
        for (const lump of lumps) {
            this.solveLump(lump);
        }
    }

    solveLump(lump) {

        let centerX = 0;
        let centerY = 0;

        for (const entity of lump) {
            centerX += entity.getFeetPos().x;
            centerY += entity.getFeetPos().y;
        }

        centerX /= lump.length;
        centerY /= lump.length;

        for (const entity of lump) {

            let dir = entity.getFeetPos().getDirXY(centerX, centerY);
            let dist = entity.getFeetPos().getDistXY(centerX, centerY);
            entity.moveInDir(dir, -1 - dist * 0.1);
        }
    }

    findLumps(entities) {

        let lumps = [];
        let checked = new Set();

        for (const entity of entities) {

            if (checked.has(entity))
                continue;

            let lump = [entity];

            for (const other of entities) {

                if (other == entity)
                    continue;

                if (checked.has(other))
                    continue;

                if (entity.getCollisionBox().checkHitboxCollision(other.getCollisionBox())) {
                    lump.push(other);
                    checked.add(other);
                }
            }

            if (lump.length > 1)
                lumps.push(lump);

            checked.add(entity);
        }

        return lumps;
    }

}

export default new OverlapHandler();