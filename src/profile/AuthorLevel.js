export class AuthorLevel {
    //member variables
    user;
    currLvl;
    lvlName;
    totalBonuses;
    totalCritiques;
    nextLevelName;
    nextLevelBonuses;
    nextLevelCritiques;

    // const map of author levels
    static levelMap = {
        1: { name: "Bookworm Baby", bonuses: 0, critiques: 0 },
        2: { name: "Bookworm Rookie", bonuses: 30, critiques: 10 },
        3: { name: "Seasoned Bookworm", bonuses: 60, critiques: 20 },
        4: { name: "Bookworm Fanatic", bonuses: 150, critiques: 50 },
        5: { name: "VIB (Very Important Bookworm)", bonuses: 300, critiques: 100 },
    };

    constructor(user, totalBonuses, totalCritiques) {
        this.user = user;
        this.currLvl = 0;
        this.totalBonuses = totalBonuses;
        this.totalCritiques = totalCritiques;
    }

    setAuthorLevel() {
        for (const [level, data] of Object.entries(AuthorLevel.levelMap)) {
            if (this.totalBonuses >= data.bonuses && this.totalCritiques >= data.critiques) {
                this.currLvl = level;
            }
        }
        this.lvlName = AuthorLevel.levelMap[this.currLvl].name;
        this.currBonuses = this.totalBonuses - AuthorLevel.levelMap[this.currLvl].bonuses;
        this.currCritiques = this.totalCritiques - AuthorLevel.levelMap[this.currLvl].critiques;
        this.nextLevelName = AuthorLevel.levelMap[parseInt(this.currLvl) + 1]?.name || "does not exist";
        this.nextLevelBonuses = AuthorLevel.levelMap[parseInt(this.currLvl) + 1]?.bonuses || 0;
        this.nextLevelCritiques = AuthorLevel.levelMap[parseInt(this.currLvl) + 1]?.critiques || 0;
    }

    getAuthorLevel() {
        return this.currLvl;
    }

    getTotalBonuses() {
        return this.totalBonuses;
    }

    getTotalCritiques() {
        return this.totalCritiques;
    }

    getLvlName() {
        return this.lvlName;
    }

    getNextLevelName() {
        return this.nextLevelName;
    }

    getNextLevelBonuses() {
        return this.nextLevelBonuses;
    }

    getNextLevelCritiques() {
        return this.nextLevelCritiques;
    }
}