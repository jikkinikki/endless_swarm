class LevelHandler {
    constructor() {
        this.currentXp = 0;
        this.currentLevel = 0;
    }

    addXp(deltaXp) {
        this.currentXp += deltaXp;
    }

    nextLevel() {

        this.currentLevel++;
        this.currentXp = 0;
    }

    getCurrentLevel() {

        //each level reqiures double the xp of the previous level, starting at x xp
        let level = 0;
        let nextLevelXp = 10;
        let totalXp = this.currentXp;

        while (totalXp >= nextLevelXp) {

            totalXp -= nextLevelXp;
            nextLevelXp *= 2;
            level++;
        }

    }
}

export default new LevelHandler();