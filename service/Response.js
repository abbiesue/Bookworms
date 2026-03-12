class Response {
    //member variables for username, text, prompt, date, reactions, and critiques
    username;
    text;
    prompt;
    date;
    timestamp;
    reactions;
    critiques;

    constructor(username, prompt, text) {
        this.username = username;
        this.prompt = prompt;
        this.text = text;
        this.date = new Date().toISOString().split('T')[0]
        this.timestamp = new Date().toISOString();
        this.reactions = new ReactionPanel();
        this.critiques = [];
    }

    //getters
    getUsername() { return this.username; }
    getPrompt() { return this.prompt; }
    getText() { return this.text; }
    getDate() { return this.date; }
    getTimestamp() { return this.timestamp; }
    getReactions(username) { return this.reactions.getReactionData(username); }
    getCritiques() { return this.critiques; }

    //updaters
    updateText(text) {
        const today = new Date().toISOString().split('T')[0];
        if (this.date === today) {
            this.text = text;
        }
    }

    updateReaction(reactionType, user) {
        if (this.reactions) {
            switch (reactionType) {
                case 'like':
                    this.reactions.updateLikes(user);
                    break;
                case 'laugh':
                    this.reactions.updateLaughs(user);
                    break;
                case 'cry':
                    this.reactions.updateCries(user);
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
        this.date = new Date().toISOString();
    }
}

class ReactionPanel {
    likes = [];
    laughs = [];
    cries = [];

    getReactionData(username) {
        return {
            likeCount: this.likes.length,
            laughCount: this.laughs.length,
            cryCount: this.cries.length,
            userReacted: {
                like: this.likes.includes(username),
                laugh: this.laughs.includes(username),
                cry: this.cries.includes(username),
            }
        };
    }

    getLikeCount() {return this.likes.length;}

    getLaughCount() {return this.laughs.length;}

    getCryCount() {return this.cries.length;}

    updateLikes(user) {
        if (!this.likes.includes(user)) {
            this.likes.push(user);
        } else {
            this.likes = this.likes.filter(u => u !== user);
        }
    }

    updateLaughs(user) {
        if (!this.laughs.includes(user)) {
            this.laughs.push(user);
        } else {
            this.laughs = this.laughs.filter(u => u !== user);
        }
    }

    updateCries(user) {
        if (!this.cries.includes(user)) {
            this.cries.push(user);
        } else {
            this.cries = this.cries.filter(u => u !== user);
        }
    }
}

module.exports = { Response };