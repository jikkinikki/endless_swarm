import MapHandler from "../map/MapHandler.js";
import TileHandler from "../map/TileHandler.js";
import MapEditor from "../map/MapEditor.js";
import Prefabs from "../Prefabs.js";

import Player from "../entities/players/Player.js";
import Handler from "../engine/handlers/Handler.js";
import Renderer from "../engine/handlers/Renderer.js";
import UICard from "../UI/UICard.js";
import Vector2 from "../engine/Tools/Vector2.js";
import PickupHp from "../pickups/PickupHP.js";
import Tile from "../map/Tile.js";
import KeyboardInput from "../engine/inputs/KeyboardInput.js";
import TimeHandler from "../engine/handlers/TimeHandler.js";
import GameProgHandler from "../engine/handlers/GameProgHandler.js";
import UIPaused from "../UI/UIPaused.js";
import MissionObj from "../Missions/MissionObj.js";
import Mission from "../Missions/Mission.js";
import MissKillBoss from "../Missions/MissKillBoss.js";
import PickupScraps from "../pickups/PickupScraps.js";
import UIInventory from "../UI/UIInventory.js";
import Debug from "../engine/debug/Debug.js";
import MouseInput from "../engine/inputs/MouseInput.js";

import map1 from "../../maps/map1.json"
import Anvil from "../objects/Anvil.js";
import UIAnvil from "../UI/UIAnvil.js";
import UIHp from "../UI/UIHp.js";
import UITextElem from "../UI/UITextElem.js";
import PlWizard from "../entities/players/PlWizard.js";
import PlDino from "../entities/players/PlDino.js";
import PlBard from "../entities/players/PlBard.js";
import PlDwarf from "../entities/players/PlDwarf.js";
import Timer from "../engine/debug/Timer.js";
import ShadowsHandler from "../engine/handlers/ShadowsHandler.js";
import SceneBase from "./SceneBase.js";
import PlayerControllerBase from "../engine/inputs/PlayerControllerBase.js";
import ChunkingHandler from "../engine/handlers/ChunkingHandler.js";
import PickupXP from "../pickups/PickupXP.js";
import UILevelUp from "../UI/UILevelUp.js";
import PlSosi from "../entities/players/PlSosi.js";
import UIBossBar from "../UI/UIBossBar.js";
import PersistantData from "./PersistantData.js";
import OverlapHandler from "../engine/handlers/OverlapHandler.js";
import ParticleHandler from "../engine/handlers/ParticleHandler.js";

import lobbyData from "../../maps/lobby_data.json";
// import lobbyData from "../../maps/test_data.json";


export default class ScPlayBase extends SceneBase {

    constructor() {

        super();

        this._frameStepping = false;

        document.addEventListener("keyup", e => {

            if (e.key == "f") {

                this._frameStepping = !this._frameStepping;

                if (!this._frameStepping)
                    this._gameLoop(this);
            }

            if (e.key == "g" && this._frameStepping)
                this._gameLoop(this);
        })
    }

    loadAll() {

        this._loadHandlers();
        this._loadObjects();
        this._loadUI();

        this._run();
    }

    _loadObjects() {

        Handler.addObj(new Anvil(new Vector2(16 * 50, 16 * 25)), ["objs"]);
        Handler.addObj(new Anvil(new Vector2(16 * 20, 16 * 65)), ["objs"]);
        

        // const playerPos = new Vector2(Renderer.canvas.width / 2, Renderer.canvas.height / 2);
        const playerPos = new Vector2(20 * 16, 20 * 16);
        // const player = new PlBard(playerPos);

        let player;

        if (PersistantData.keyExists("player1")) {

            const playerClass = PersistantData.getData("player1");
            player = new playerClass(playerPos);

        } else
            // player = new PlSosi(playerPos);
            // player = new PlDwarf(playerPos);
            // player = new PlBard(playerPos);
            // player = new PlDino(playerPos);
            player = new PlWizard(playerPos);


        Handler.addObj(player, ["team1"]);
        Handler.addObj(new PlayerControllerBase().setEntity(player), ["inputs"]);

        let pl2Scheme = {

            "move_up": "y",
            "move_left": "g",
            "move_down": "h",
            "move_right": "j",
        }
        
        // let player2 = new PlSosi(playerPos.clone());
        // Handler.addObj(player2, ["team1"]);
        // Handler.addObj(new PlayerControllerBase(pl2Scheme).setEntity(player2), ["inputs"]);

        // Handler.addObj(new MissionObj(new MissKillBoss(), Handler.getPlayers()[0].position.clone()), ["missions"]);

        Handler.addObj(new PickupScraps(new Vector2(350, 350)), ["pickups"]);

        Handler.addObj(new PickupHp(new Vector2(350, 400)), ["pickups"]);

        for (let i = 0; i < 10; i++) {
            Handler.addObj(new PickupXP(new Vector2(450 + i * 3, 300)), ["pickups"]);
        }

        Handler.addObj(Debug, ["debug"]);
    }

    _loadHandlers() {

        MapHandler.loadMap(map1);

        GameProgHandler.setGameData(lobbyData);

        Handler.addObj(MouseInput, ["inputs"]);
        Handler.addObj(KeyboardInput, ["inputs"]);

        Handler.addObj(ShadowsHandler, ["handlers"]);
        Handler.addObj(MapEditor, ["map", "handlers"]);


        Handler.addObj(TimeHandler, ["handlers"]);
        Handler.addObj(GameProgHandler, ["handlers"]);
        Handler.addObj(MapHandler, ["handlers"]);
        Handler.addObj(ChunkingHandler, ["handlers"]);
        Handler.addObj(OverlapHandler, ["handlers"]);
        Handler.addObj(ParticleHandler, ["handlers"]);
    }

    _loadUI() {

        Handler.addObj(new UIBossBar(), ["UI", "UI_boss_bar"]);
        Handler.addObj(new UIAnvil(new Vector2(0, 0), new Vector2(0, 0)), ["UI", "UI_anvil"]);
        Handler.addObj(new UILevelUp(new Vector2(0, 0), new Vector2(0, 0)), ["UI", "UI_anvil"]);

        Handler.addObj(new UIPaused(new Vector2(Renderer.canvas.width / 2, Renderer.canvas.height / 2.3)), ["UI"]);
        Handler.addObj(new UIInventory(new Vector2(Renderer.canvas.width / 4, Renderer.canvas.height / 1.5)), ["UI"]);

        Handler.addObj(new UIHp(), ["UI", "p1_HP"]);
        Handler.addObj(new UITextElem("game-time-disp", obj => (obj.setText(TimeHandler.getTimeText()))), ["UI", "p1_HP"]);
        Handler.addObj(new UITextElem("player-xp", obj => (obj.setText(Handler.getPlayers()[0]._lvl))), ["UI", "p1_XP"]);

        Handler.addObj(new UITextElem("ability-time", obj => {

            /** @type {Player} */
            const player = Handler.getPlayers()[0];

            const time1 = player.spells.length > 0 ? Math.round(player.spells[0].timeUntilReady() / 1000) : 0;
            const time2 = player.spells.length > 1 ? Math.round(player.spells[1].timeUntilReady() / 1000) : 0;

            obj.setText(`Q: ${time1} R: ${time2}`);

        }), ["UI", "p1_HP"]);

        Handler.addObj(new UICard(new Vector2(10, 20), new Vector2((Renderer.canvas.width - 20) / 3, Renderer.canvas.height - 40)), ["UI", "UI_card1"]);

        Handler.getEntitiesByTag("UI_card1")[0].description = "This is a card";
        Handler.getEntitiesByTag("UI_card1")[0].hidden = true;
    }

    _gameLoop(thisScene) {

        // thisScene._tickTimer.start();
        Handler.tick();

        if (frames % 6000000000000000 == 0)
            console.log("tick time: " + tickTimer.totTime, "fps: " + (1000 / tickTimer.totTime));

        // thisScene._tickTimer.reset();
        // thisScene._tickTimer.start();

        Handler.render(Renderer);

        if (frames % 6000000000000000 == 0) {

            console.log("render time: " + tickTimer.totTime, "fps: " + (1000 / tickTimer.totTime));
            console.log("---------------");
        }

        // thisScene._tickTimer.reset();

        thisScene._frames++;

        if (!this._frameStepping)
            requestAnimationFrame(() => { this._gameLoop(this) });
    }

    _run() {
        // this._tickTimer = new Timer();
        this._frames = 0;

        if (!this._frameStepping)
            requestAnimationFrame(() => { this._gameLoop(this) });
    }
}
