import { Handler } from "src/js/imports";
import ScPlayBase from "../../scenes/ScPlayBase";
import SCPlayLobby from "../../scenes/ScPlayLobby";
import CameraController from "./CameraController";
import TimeHandler from "./TimeHandler";

class SceneHandler {

    constructor() {

        this.scenes = {

            "lobby": SCPlayLobby,
            "test_level": ScPlayBase
        }

        this.activeScene = "";
        this._firstLoad = true;
    }

    loadScene(sceneName) {

        if(this._firstLoad){
            this._loadListeners();
            this._firstLoad = false;
        }

        if(this.activeScene != "")
            this.unloadActiveScene();

        new this.scenes[sceneName]().loadAll();
        this.activeScene = sceneName;
    }

    _loadListeners() {

        window.addEventListener("blur", () => {
            
            Handler.paused = true;
        })

        window.addEventListener("keyup", e => {

            if (e.key == "p")
                Handler.paused = !Handler.paused;
        })
    }

    unloadActiveScene() {

        Handler.reset();
        CameraController.reset();
        TimeHandler.reset();
    }
}

export default new SceneHandler();