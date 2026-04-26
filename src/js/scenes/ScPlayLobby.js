import MapHandler from "../map/MapHandler.js";
import Handler from "../engine/handlers/Handler.js";
import Renderer from "../engine/handlers/Renderer.js";
import Vector2 from "../engine/Tools/Vector2.js";
import Debug from "../engine/debug/Debug.js";
import PlDwarf from "../entities/players/PlDwarf.js";

import map from "../../maps/lobby_map.json"
import Anvil from "../objects/Anvil.js";
import CameraController from "../engine/handlers/CameraController.js";
import ScPlayBase from "./ScPlayBase.js";
import UICharacterSelect from "../UI/UICharacterSelect.js";
import PlayerControllerBase from "../engine/inputs/PlayerControllerBase.js";

export default class SCPlayLobby extends ScPlayBase {

    constructor() {

        super();
    }

    _loadObjects() {

        Handler.addObj(new Anvil(new Vector2(3 * MapHandler.getTileSize(), 3 * MapHandler.getTileSize())), ["UI"]);

        let playerPos = new Vector2(6 * MapHandler.getTileSize(), 6 * MapHandler.getTileSize())
        const player = new PlDwarf(playerPos);

        Handler.addObj(player, ["team1"]);
        Handler.addObj(new PlayerControllerBase().setEntity(player), ["inputs"]);
        Handler.addObj(Debug, ["debug"]);
    }

    _loadUI() {

        super._loadUI();

        Handler.addObj(new UICharacterSelect(), ["UI"]);
    }

    _loadHandlers() {

        super._loadHandlers();

        MapHandler.loadMap(map);

        CameraController.setOverrideMode("full");
        CameraController.setAdjustment(new Vector2(MapHandler.mapSize._x * MapHandler.getTileSize(), Renderer.canvas.height / 4));
    }
}