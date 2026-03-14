class ArchiveEntry {
    username;
    date;
    prompt;
    text;
    bonuses;
    critiquesPosted;

    constructor(response, bonusSet, critiquesPosted) {
        this.username = response.getUsername();
        this.date = response.getDate();
        this.prompt = response.getPrompt();
        this.text = response.getText();
        this.bonuses = bonusSet.getBonuses();
        this.critiquesPosted = critiquesPosted;
    }
}

module.exports = { ArchiveEntry };