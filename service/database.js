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

//we will need functions to manipulate each collection

//--------USER FUNCTIONS--------
//------------------------------

//------RESPONSE FUNCTIONS------
//------------------------------

//-------ARCHIVE FUNCTIONS------
//------------------------------

//-------BONUSES FUNCTIONS------
//------------------------------