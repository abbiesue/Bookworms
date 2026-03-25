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
//add
//update
//remove

//------------------------------

//------RESPONSE FUNCTIONS------
//get
//add
//update
//remove
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