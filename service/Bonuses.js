const bonusPool = {
    perspective: [
        'Write in {pov} person.'
    ],
    setting: [
        'Set your response in {place}.',
        'Set your response in {time}.'
    ],
    style: [
        'Write your response as {style}.',
        'Make your response fewer than 100 words.'
    ],
    character: [
        'Make one character a(n) {role}.',
        'Make yourself the {part}.',
        'Make the {part} a(n) {role}.'
    ],
    vocabulary: [
        'Include the word "{word}" in your response.',
    ]
};

const fillins = {
    pov: ['first', 'second', 'third'],
    place: ['Ancient Rome', 'space', 'the wild west', 'a dystopian city', 'the mountains', 'a forest', 'a magic kingdom', 'a small town', 'a bustling city', 'underwater', 'a desert', 'a highschool'],
    time: ['the past', 'the future'],
    style: ['dialogue only', 'a series of journal entries', 'one or more letters between friends', 'a screenplay', 'a news broadcast'],
    role: ['doctor', 'cowboy', 'alien', 'college professor', 'superhero', 'robot', 'child', 'musician'],
    part: ['protagonist', 'antagonist', 'sidekick', 'mentor', 'love interest']
};

// picks a random item from an array
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// fills in any {placeholder} tokens in a template string
function fillTemplate(template, word) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        if (key === 'word') return word;
        if (fillins[key]) return getRandom(fillins[key]);
        return match; // leave it as-is if no fill-in found
    });
}

// picks 3 random non-repeating categories and generates a bonus from each
function generateBonuses(word) {
    const categories = Object.keys(bonusPool);
    const chosen = [];
    const bonuses = [];

    while (chosen.length < 3) {
        const category = getRandom(categories);
        if (!chosen.includes(category)) {
            chosen.push(category);
            const template = getRandom(bonusPool[category]);
            bonuses.push({ text: fillTemplate(template, word), completed: false });
        }
    }

    return bonuses;
}

async function getWordOfTheDay() {
    const response = await fetch(
        `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${process.env.WORDNIK_API_KEY}`
    );
    const data = await response.json();
    return data.word;
}

class BonusSet {
    username;
    date;
    bonuses;

    constructor(username, word) {
        this.username = username;
        this.date = new Date().toISOString().split('T')[0];
        this.bonuses = generateBonuses(word);
    }

    getUsername() { return this.username; }
    getDate() { return this.date; }
    getBonuses() { return this.bonuses; }
    getBonusTexts() { return this.bonuses.map(b => b.text); }
    updateCompletion(index, completed) {
        if (this.bonuses[index] !== undefined) {
            this.bonuses[index].completed = completed;
        }
    }
}

module.exports = { BonusSet, getWordOfTheDay };