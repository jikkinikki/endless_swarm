import Handler from "../engine/handlers/Handler";
import TimeHandler from "../engine/handlers/TimeHandler";

export default class Mission {

    constructor(timeLimit, difficulty) {

        this.timeLimit = timeLimit;
        this.timeStarted = TimeHandler.totGameTime;
        this.difficulty = difficulty;
        this.done = false;

        this.tasks = [

            () => { return true; },
        ];
    }

    onMissionStart() {

    }

    tick() {

        if (TimeHandler.totGameTime - this.timeStarted >= this.timeLimit)
            this.onFailed();

        if (this.checkIfCompleted())
            this.onSuccessful();
    }

    checkIfCompleted() {

        for (const task of this.tasks) {

            if (!task())
                return;
        }

        this.onSuccessful();
    }

    onSuccessful() {
    
        this.done = true;
    }

    onFailed() {

    }

    onRemove(){


    }
}