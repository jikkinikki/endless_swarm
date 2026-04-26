import Player from "../entities/players/Player";
import Handler from "../engine/handlers/Handler";
import Prefabs from "../Prefabs";
import { Vector2_zero } from "../engine/Tools/Vector2";
import UIElem from "./UIElem";
import SceneHandler from "../engine/handlers/SceneHandler";
import PersistantData from "../scenes/PersistantData";

export default class UICharacterSelect extends UIElem {

    constructor() {

        super(Vector2_zero, Vector2_zero, "character-select");

        this.loadCharacters();
        this.setVisible(true);
        this.addListeners();
    }

    addListeners() {

        let continueBtn = this.getElem().querySelector("#continue-btn");

        continueBtn.addEventListener("click", () => {

            SceneHandler.loadScene("test_level");
        });
    }

    loadCharacters() {

        let characters = Prefabs.getPrefabs("playable", false);

        let lastLoaded = null;

        for (const character of characters) {

            lastLoaded = this.loadCharacter(character);
        }

        lastLoaded.click();
    }

    loadCharacter(character) {
        let charactersDiv = this.getElem().querySelector("#all-characters");

        let characterInstance = new character(Vector2_zero);
        let innerDiv = document.createElement("div");
        let characterImg = this.createElement("div", "", innerDiv, "", ["character-img"]);

        if (characterInstance.anim) {
            let anim = characterInstance.anim;
            let offset = anim.startOffset;

            characterImg.style.backgroundImage = `url(${anim.path})`;
            characterImg.style.backgroundPosition = `-${offset.x}px -${offset.y}px`;
        }
        else {

            let interval = setInterval(() => {

                if (characterInstance.anim) {
                    let anim = characterInstance.anim;
                    let offset = anim.startOffset;

                    characterImg.style.backgroundImage = `url(${anim.path})`;
                    characterImg.style.backgroundPosition = `-${offset.x}px -${offset.y}px`;

                    clearInterval(interval);
                }
                // else
                // console.log("try again :)");


            }, 100);
        }

        this.createElement("p", characterInstance.constructor.name, innerDiv, "", ["character-name"]);

        charactersDiv.appendChild(innerDiv);

        innerDiv.addEventListener("click", () => {

            let currentPlayer = Handler.getPlayers()[0];

            //if not same character
            if (currentPlayer.entName != characterInstance.entName) {

                PersistantData.addData("player1", character, true);
                Handler.removeObj(currentPlayer);
                characterInstance.position = currentPlayer.position;

                Handler.addObj(characterInstance, ["team1"]);
                this.setCharacterText(characterInstance);
            }
        });

        return innerDiv;
    }

    setCharacterText(character) {

        let characterText = this.getElem().querySelector("#selected-character-info");
        characterText.innerHTML = "";

        let spells = character.spells;

        this.createTextElem("h1", character.entName, characterText);


        let buttons = ["Q", "R", "passive"]
        for (let i = 0; i < spells.length; i++) {
            const spell = spells[i];

            this.createTextElem("h2", spell.name + " (" + buttons[i] + ")", characterText);
            this.createTextElem("p", spell.desc, characterText);
        }


        console.log(character);
        
    }

    createTextElem(textType, text, parent, classes, id){

        let textElem = document.createElement(textType);
        textElem.textContent = text;
        parent.appendChild(textElem);

        if (classes)
            textElem.classList.add(...classes);

        if (id)
            textElem.id = id;

        return textElem;
    }

    tick() {


    }
}
