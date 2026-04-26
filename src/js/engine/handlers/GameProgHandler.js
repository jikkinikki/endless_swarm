import EntBee from "../../entities/EntBee";
import EntGooper from "../../entities/EntGooper";
import TimeHandler from "./TimeHandler";
import Vector2, { Vector2_zero } from "../Tools/Vector2";
import MapHandler from "../../map/MapHandler";
import Monster from "../../entities/Monster";
import HandlerBase from "./HandlerBase";

// import lobbyData from "../../../maps/lobby_data.json";
import Prefabs from "../../Prefabs";
import Handler from "./Handler";

class GameProgHandler extends HandlerBase {

    constructor() {

        super();

        this.gameProg = [];
        // this.gameProg = lobbyData.events;

        this._eventFuncMapping = {

            "spawn": this.handleSpawn.bind(this),
            // "mission": this.updateMission.bind(this),
        }

        this.allowedEntities = {};

        /** @type {Monster[]} */
        this.enemyBuffer = [];
    }

    setGameData(data) {

        this.gameProg = data.events;
        this.gameProg.sort((a, b) => a.time - b.time);
    }

    handleSpawn(data) {

        const mode = data.mode;

        if (mode === "instant") {
            this.spawnInstant(data);
        }
        else if (mode === "instant_near") {
            this.spawnInstantNear(data);
        }
        else if (mode === "update") {
            this.spawnUpdate(data);
        }
    }

    spawnInstantNear(data) {

        const enemyClassName = data.entity;
        const amount = data.amount;
        const obj = Prefabs.getPrefabByClassName(enemyClassName);

        const playerPos = Handler.getPlayers()[0].position.clone();
        let randX;
        let randY;
        let range = 100;

        for (let i = 0; i < amount; i++){

            randX = Math.random() * range - range / 2;
            randY = Math.random() * range - range / 2;
            this.spawnEntity(obj, playerPos.clone().addxy(randX, randY));
        }
    }

    spawnInstant(data) {

        const enemyClassName = data.entity;
        const amount = data.amount;
        const obj = Prefabs.getPrefabByClassName(enemyClassName);

        for (let i = 0; i < amount; i++)
            this.spawnEntity(obj);
    }

    spawnUpdate(data) {

        // const enemyClassName = data.entity;
        // const intensity = data.intensity;

        this.updateAllowedEntites(data);
    }

    updateAllowedEntites(data) {

        // return;
        const className = data.entity;
        const intensity = data.intensity;

        const preparedData = {

            "obj": Prefabs.getPrefabByClassName(className),
            "intensity": intensity,
            "spawned": 0,
            "startTime": TimeHandler.totGameTime - intensity * 1000 / 2,
        }

        this.allowedEntities[className] = preparedData;

        // if (Object.keys(this.allowedEnemies).includes(enemyObj)) {
        // }

        // this.allowedEnemies.push();
    }

    loadGameProg() {

        const currentTime = TimeHandler.totGameTime / 1000;

        for (let i = 0; i < this.gameProg.length; i++) {

            const event = this.gameProg[i];

            if (currentTime >= event.time) {

                this._eventFuncMapping[event.type](event);
                this.gameProg.splice(i, 1);
                i--;
            }
            else {
                break;
            }
        }

        // for (const key of Object.keys(this.gameProg)) {

        //     if (currentTime > key) {

        //         for (const func of this.gameProg[key])
        //             func();

        //         delete this.gameProg[key];
        //     }
        // }
    }

    tick() {

        this.loadGameProg();

        for (const enemyKey of Object.keys(this.allowedEntities)) {

            const entity = this.allowedEntities[enemyKey];

            const deltaTimeSecs = (TimeHandler.totGameTime - entity.startTime) / 1000;
            const targetSpawned = deltaTimeSecs * entity.intensity; // 4
            const deltaSpawns = targetSpawned - entity.spawned; // 4

            // const baseChance = 0.025 / 60;
            const baseChance = 0;

            const balancedSpawning = Math.max(Math.min(1, deltaSpawns / 600), 0);

            // console.log(Math.floor(deltaSpawns), enemy.spawned);

            if (Math.random() < baseChance + balancedSpawning) { // 4

                // const pos = new Vector2(Math.random() * Renderer.canvas.width, Math.random() * Renderer.canvas.height);
                this.spawnEntity(entity.obj);
                entity.spawned++;
            }

        }

        this.tryLoadBufferedEnemies();
    }

    spawnEntity(enemyTemplate, position = new Vector2(0, 0)) {

        if (typeof enemyTemplate !== "function") {
            // throw new Error("enemyTemplate is not a constructor");
            console.error("enemyTemplate is not a constructor", enemyTemplate);
            return;
        }

        const enemy = new enemyTemplate(position);
        this.enemyBuffer.push(enemy);

        // const pos = MapHandler.getRandomValidSpawnPos();
        // Handler.addObj(, ["team2"]);
    }

    tryLoadBufferedEnemies() {

        for (let r = this.enemyBuffer.length - 1; r >= 0; r--) {

            const enemy = this.enemyBuffer[r];

            if (enemy.isReady()) {

                if (enemy.position.equals(Vector2_zero)) {
                    const feetOffset = enemy.getFeetPos().clone().add(enemy.position.clone().scale(-1));
                    enemy.position = MapHandler.getRandomValidSpawnPos().add(feetOffset.scale(-1));
                }
                
                Handler.addObj(enemy, ["team2"]);
                this.enemyBuffer.splice(r, 1);
            }
        }
    }

    render(ctx) {

    }
}

export default new GameProgHandler();