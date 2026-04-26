import MapHandler from "./map/MapHandler.js";
import TileHandler from "./map/TileHandler.js";
import MapEditor from "./map/MapEditor.js";

import Player from "./entities/players/Player.js";
import Handler from "./engine/handlers/Handler.js";
import Renderer from "./Renderer.js";
import UICard from "./UI/UICard.js";
import Vector2 from "./engine/Tools/Vector2.js";
import PickupHp from "./pickups/PickupHP.js";
import Tile from "./map/Tile.js";
import KeyboardInput from "./engine/inputs/KeyboardInput.js";
import TimeHandler from "./engine/handlers/TimeHandler.js";
import GameProgHandler from "./engine/handlers/GameProgHandler.js";
import UIPaused from "./UI/UIPaused.js";
import MissionObj from "./Missions/MissionObj.js";
import Mission from "./Missions/Mission.js";
import MissKillBoss from "./Missions/MissKillBoss.js";
import PickupScraps from "./pickups/PickupScraps.js";
import UIInventory from "./UI/UIInventory.js";
import Debug from "./Debug.js";
import MouseInput from "./engine/inputs/MouseInput.js";

import map1 from "../maps/map1.json"
import Anvil from "./objects/Anvil.js";
import UIAnvil from "./UI/UIAnvil.js";
import UIHp from "./UI/UIHp.js";
import UITextElem from "./UI/UITextElem.js";
import PlWizard from "./entities/players/PlWizard.js";
import PlDino from "./entities/players/PlDino.js";
import PlBard from "./entities/players/PlBard.js";
import PlDwarf from "./entities/players/PlDwarf.js";
import Timer from "./engine/debug/Timer.js";
import Validator from "./engine/debug/Validator.js";
import ShadowsHandler from "./engine/handlers/ShadowsHandler.js";

MapHandler.loadMap(map1);

Handler.addObj(ShadowsHandler, ["handlers"]);
// Handler.addObj(new Tile(), ["map"]);
Handler.addObj(MapEditor, ["map"]);

Handler.addObj(KeyboardInput, ["inputs"]);
Handler.addObj(MouseInput, ["inputs"]);

Handler.addObj(TimeHandler, ["handlers"]);
Handler.addObj(GameProgHandler, ["handlers"]);
Handler.addObj(MapHandler, ["handlers"]);

Handler.addObj(new Anvil(new Vector2(Renderer.canvas.width / 2 + 200, 16 * 5)), ["objs"]);
Handler.addObj(new PlDwarf(new Vector2(Renderer.canvas.width / 2, Renderer.canvas.height / 2)), ["team1"]);

// Handler.addObj(new MissionObj(new MissKillBoss(), Handler.getPlayers()[0].position.clone()), ["missions"]);

Handler.addObj(new PickupScraps(new Vector2(350, 350)), ["pickups"]);

Handler.addObj(new UIAnvil(new Vector2(0, 0), new Vector2(0, 0)), ["UI", "UI_anvil"]);

// Handler.addObj(new UITimeDisp(new Vector2(Renderer.canvas.width / 2, 40)), ["UI"]);

Handler.addObj(new UIPaused(new Vector2(Renderer.canvas.width / 2, Renderer.canvas.height / 2.3)), ["UI"]);
Handler.addObj(new UIInventory(new Vector2(Renderer.canvas.width / 4, Renderer.canvas.height / 1.5)), ["UI"]);

Handler.addObj(new UIHp(), ["UI", "p1_HP"]);
Handler.addObj(new UITextElem("game-time-disp", obj => (obj.setText(TimeHandler.getTimeText()))), ["UI", "p1_HP"]);
Handler.addObj(new UITextElem("player-xp", obj => (obj.setText(Handler.getPlayers()[0]._lvl))), ["UI", "p1_XP"]);
// Handler.addObj(new UITextElem("player-xp", obj => { }), ["UI", "XP_DISP"]);

Handler.addObj(new UITextElem("ability-time", abilityFunc = obj => {

    /** @type {Player} */
    const player = Handler.getPlayers()[0];

    const time1 = player.spells.length > 0 ? Math.round(player.spells[0].timeUntilReady() / 1000) : 0;
    const time2 = player.spells.length > 1 ? Math.round(player.spells[1].timeUntilReady() / 1000) : 0;

    obj.setText(`E: ${time1} R: ${time2}`);

}), ["UI", "p1_HP"]);

Handler.addObj(new UICard(new Vector2(10, 20), new Vector2((Renderer.canvas.width - 20) / 3, Renderer.canvas.height - 40)), ["UI", "UI_card1"]);

Handler.getEntitiesByTag("UI_card1")[0].description = "This is a card";
Handler.getEntitiesByTag("UI_card1")[0].hidden = true;

Handler.addObj(new PickupHp(new Vector2(400, 400)), ["pickups"]);

Handler.addObj(Debug, ["debug"]);

const step = 10;

for (let y = 0; y < Renderer.canvas.height / step; y++) {
    for (let x = 0; x < Renderer.canvas.width / step; x++) {

        // Handler.addEntity(new AIBee(new Vector2(x * step, y * step)));
    }

}

window.addEventListener("blur", () => {

    Handler.paused = true;
})

window.addEventListener("keyup", e => {

    if (e.key == "p")
        Handler.paused = !Handler.paused;
})

setInterval(() => {

    // MapHandler.render(Renderer.ctx);

}, 1000 / 60)

let tickTimer = new Timer();
let frames = 0;

function gameLoop() {

    tickTimer.start();
    Handler.tick();

    if (frames % 6000000000000000 == 0)
        console.log("tick time: " + tickTimer.totTime, "fps: " + (1000 / tickTimer.totTime));

    tickTimer.reset();
    tickTimer.start();

    Handler.render(Renderer);

    if (frames % 6000000000000000 == 0) {

        console.log("render time: " + tickTimer.totTime, "fps: " + (1000 / tickTimer.totTime));
        console.log("---------------");

    }


    tickTimer.reset();

    frames++;

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);