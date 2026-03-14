const fs = require('fs');
const path = require('path');
const archivePath = path.join(__dirname, 'archive.json');

function loadArchive() {
    try {
        const data = fs.readFileSync(archivePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function saveArchive(entries) {
    fs.writeFileSync(archivePath, JSON.stringify(entries, null, 2));
}

function addEntry(entry) {
    const entries = loadArchive();
    entries.push(entry);
    saveArchive(entries);
}

module.exports = { loadArchive, saveArchive, addEntry };