class Response {
    //member variables for username, text, prompt, date, reactions, and critiques
    username;
    text;
    prompt;
    date;
    reactions;
    critiques;

    constructor(username, prompt, text) {
        this.username = username;
        this.prompt = prompt;
        this.text = text;
        this.date = new Date();
        this.reactions = new ReactionPanel();
        this.critiques = [];
    }

    //getters
    getUsername() { return this.username; }
    getPrompt() { return this.prompt; }
    getText() { return this.text; }
    getDate() { return this.date; }
    getReactions() { return this.reactions; }
    getCritiques() { return this.critiques; }

    //updaters
    updateText(text) {
        const today = new Date().toDateString();
        if (this.date.toDateString() === today) {
            this.text = text;
        }
    }

    updateReaction(reactionType, count) {
        if (this.reactions) {
            switch (reactionType) {
                case 'like':
                    this.reactions.setLikeCount(count);
                    break;
                case 'laugh':
                    this.reactions.setLaughCount(count);
                    break;
                case 'cry':
                    this.reactions.setCryCount(count);
                    break;
                default:
                    break;
            }
        }
    }

    addCritique(username, text) {
        const critique = new Critique(username, text);
        this.critiques.push(critique);
    }
}

class Critique {
    //member variables for username, text, and date
    username;
    text;
    date;

    constructor(username, text) {
        this.username = username;
        this.text = text;
        this.date = new Date();
    }
}

class ReactionPanel {
    likeCount;
    laughCount;
    cryCount;

    constructor(likeCount = 0, laughCount = 0, cryCount = 0) {
        this.likeCount = likeCount;
        this.laughCount = laughCount;
        this.cryCount = cryCount;
    }

    getLikeCount() {return this.likeCount;}

    getLaughCount() {return this.laughCount;}

    getCryCount() {return this.cryCount;}

    setLikeCount(count) {this.likeCount = count;}

    setLaughCount(count) {this.laughCount = count;}

    setCryCount(count) {this.cryCount = count;}
}