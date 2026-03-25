const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('bookworms');

//collections needed: users, responses, archive, and bonuses
const userCollection = db.collection('users')
const responseCollection = db.collection('responses')
const archiveCollection = db.collection('archive')
const bonusCollection = db.collection('bonuses')

// This will asynchronously test the connection and exit the process if it fails (copied from simon project code)
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

//we will need functions to manipulate each collection

//--------USER FUNCTIONS--------
//get
function getUser(field, value){
    if (!value) return null;
    return userCollection.findOne({[field] : value});
}

//add
async function addUser(user){
    await userCollection.insertOne(user);
}

//update
async function updateUser(user){
    await userCollection.updateOne({username: user.username}, {$set: user});
}

//remove
async function removeUserToken(user){
    await userCollection.updateOne({username: user.username},{$unset: {token: 1}});
}
//------------------------------

//------RESPONSE FUNCTIONS------
//get
function getResponse(username){
    const today = new Date().toISOString().split('T')[0];
    return responseCollection.findOne({username, date: today});
}

async function getAllTodayResponses() {
    const today = new Date().toISOString().split('T')[0];
    return responseCollection.find({date: today}).sort({timestamp: 1}).toArray();
}

//add
async function addResponse(responseData){
    await responseCollection.insertOne(responseData);
}

//update
async function updateResponseText(username, text){
    const today = new Date().toISOString().split('T')[0];
    await responseCollection.updateOne(
        { username, date: today },
        { $set: { text, timestamp: new Date().toISOString() } }
    );
}

async function updateResponseReaction(username, reactionType, reactingUser) {
    const today = new Date().toISOString().split('T')[0];
    const response = await responseCollection.findOne({username, date: today});
    if (!response) return null;
    const panel = response.reactions || {likes: [], laugh: [], cries: []};
    const arrayField = reactionType === 'like' ? 'likes'
        : reactionType === 'laugh' ? 'laughs'
        : 'cries';

    if (panel[arrayField].includes(reactingUser)) {
        panel[arrayField] = panel[arrayField].filter(u => u !== reactingUser);
    } else {
        panel[arrayField].push(reactingUser);
    }

    await responseCollection.updateOne({username, date: today}, {$set: {reactions: panel}});
    return panel;
}

async function addCritique(username, critiqueObj) {
    const today = new Date().toISOString().split('T')[0];
    await responseCollection.updateOne({username, date: today}, {$push: {critiques: critiqueObj}});
    const updated = await responseCollection.findOne({ username, dat: today});
    return updated?.critiques || [];
}
//remove
async function deleteTodayResponses() {
    const today = new Date().toISOString().split('T')[0];
    await responseCollection.deleteMany({date: today});
}
//------------------------------

//-------ARCHIVE FUNCTIONS------
//get
//add
//update
//remove
//------------------------------

//-------BONUSES FUNCTIONS------
//get
//add
//update
//remove
//------------------------------

module.exports = {
    getUser, 
    addUser,
    updateUser,
    removeUserToken,
    getResponse, 
    getAllTodayResponses,
    addResponse,
    updateResponseText,
    updateResponseReaction,
    addCritique,
    deleteTodayResponses,
};