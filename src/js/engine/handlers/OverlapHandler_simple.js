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

        let entities = Handler.getObjsByInstance(Monster);

        for (let i = 0; i < 1; i++) {
     
            entities = this.solveAllOverlaps(entities);
     
            if (entities.length == 0)
                break;
        }
    }

    solveAllOverlaps(entities) {

        let movesToDo = [];

        for (const entity of entities) {

            let overlaps = this.getOverlaps(entity);
            // console.log(overlaps, entity.id, entity.getFeetPos(), entity.getFeetBox().size);

            let moveInfo = this.calcMoveDir(entity, overlaps);

            movesToDo.push(moveInfo);
        }

        // console.log(movesToDo);
        let movedEntities = [];

        for (const move of movesToDo) {
            move.entity.moveInDir(move.dir, move.amount);
            // movedEntities.push(move.entity);
        }

        return movedEntities;
    }

    calcMoveDir(entity, overlaps) {

        let deltaX = 0;
        let deltaY = 0;

        for (const overlap of overlaps) {
            deltaX += Math.cos(overlap.dir) * 30;
            deltaY += Math.sin(overlap.dir) * 30;
        }

        if (deltaX != 0 && deltaY != 0) {
            let totDir = Math.atan2(deltaY, deltaX);
            let dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2;

            return {
                entity: entity,
                dir: totDir,
                amount: dist
            };
        }

        return {
            entity: entity,
            dir: 0,
            amount: 0
        };
    }

    getOverlaps(entity) {

        let overlaps = [];

        //TODO Use correct max distance from hitbox size
        let entities = this.chunkingHandler.getNearbyObjsByClass(entity, Ent);

        for (const otherEnt of entities) {

            if (otherEnt == entity)
                continue;

            if (entity.getFeetBox().checkHitboxCollision(otherEnt.getFeetBox())) {

                //TODO Maybe remove dist if we never use it in the end? Look over to make sure no other place uses it.
                let dist = entity.getFeetPos().getDist(otherEnt.getFeetPos());
                let dir = dist == 0 ? Math.random() * Math.PI * 2 : otherEnt.getFeetPos().getDir(entity.getFeetPos());

                overlaps.push({
                    dist: dist,
                    dir: dir
                });
            }
        }

        return overlaps;
    }

}

export default new OverlapHandler();