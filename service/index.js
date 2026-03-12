const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const { Response } = require('./response');
const app = express();

const authCookieName = 'token';

//space to store all stuff that will be mapped to a database
let users = [];
let responses = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// ---------------LOGIN ENDPOINTS---------------
//CreateAuth - register a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Email already in use' });
    } else if (await findUser('username', req.body.username)) {
        res.status(409).send({ msg: 'Username already taken' });
    } else {
        const user = await createUser(req.body.username, req.body.email, req.body.password);
        setAuthCookie(res, user.token);
        res.send({ username: user.username, email: user.email });
    }
});

//GetAuth - login an existing user
apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
        user.token = uuid.v4();
        setAuthCookie(res, user.token);
        res.send({ username: user.username, email: user.email });
        return;
        }
    }
    res.status(401).send({ msg: 'Invalid username or password' });
});

//DeleteAuth - logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});
// ---------------------------------------------

//verifyAuth - verify a user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

//verifyResponded = verify a user has responded before calling an endpoint
const verifyResponded = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        const userResponse = getResponse(user.username);
        if (userResponse) {
            next();
        } else {
            res.status(403).send({ msg: 'User has not responded' });
        }
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
}

// ------------RESPONSE ENDPOINTS---------------
//SubmitResponse - should not submit response if user is not logged in
apiRouter.post('/response/submit', verifyAuth, async (req, res) => {
    const { prompt, text } = req.body;
    const user = await findUser('token', req.cookies[authCookieName]);
    const username = user.username;
    const response = new Response(username, prompt, text);
    responses.push(response);
    res.status(201).send(response);
});

//EditResponse - endpoint for editing the response text
apiRouter.put('/response/edit', verifyAuth, verifyResponded, async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    const text = req.body.text;
    const response = getResponse(user.username);
    if (response) {
        const today = new Date().toISOString().split('T')[0];
        if (response.getDate() !== today) {
            return res.status(403).send({ msg: 'Cannot edit a previous day\'s response' });
        }
        response.updateText(text);
        res.send(response);
    } else {
        res.status(404).send({ msg: 'Response not found' });
    }
});

//GetAllResponses - get all stored responses
apiRouter.get('/response/all', verifyAuth, verifyResponded, async (req, res) => {
    // send responses back in order they were recieved with the current logged in user's at the top
    const user = await findUser('token', req.cookies[authCookieName]);
    const userResponse = getResponse(user.username);
    const otherResponses = responses
        .filter((r) => r.username !== user.username)
        .sort((a, b) => new Date(a.getTimestamp()) - new Date(b.getTimestamp()));
    res.send(userResponse ? [userResponse, ...otherResponses] : otherResponses);
});

//GetUserResponse - get the response of the person logged in
apiRouter.get('/response/user', verifyAuth, async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    const userResponse = getResponse(user.username);
    if (userResponse) {
        res.send({ responded: true, response: userResponse });
    } else {
        res.send({ responded: false });
    }
});

//AddReaction - changes the reaction 
apiRouter.post('/response/reaction', verifyAuth, verifyResponded,async (req, res) => {
  const responseAuthor = req.body.responseAuthor;
  const authorResponse = getResponse(responseAuthor);
  if (authorResponse) {
    const reactionType = req.body.reactionType;
    const user = await findUser('token', req.cookies[authCookieName]);
    authorResponse.updateReaction(reactionType, user.username);
    res.status(201).send(authorResponse.getReactions(user.username));
  } else {
    res.status(404).send({ msg: 'Response not found' });
  }
});

//AddCritique
apiRouter.post('/response/critique', verifyAuth, verifyResponded, async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    const { responseAuthor, critiqueText } = req.body;
    const response = getResponse(responseAuthor);
    if (response) {
        response.addCritique(user.username, critiqueText);
        res.send(response.getCritiques());
    } else {
        res.status(404).send({ msg: 'Response not found' });
    }
});
// ---------------------------------------------

//basic error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

//return basic page if path unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

//getResponse - get a response by username
function getResponse(username) {
  return responses.find((r) => r.username === username);
}

//createUser
async function createUser(username, email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    username: username,
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  users.push(user);
  return user;
}

//findUser
async function findUser(field, value) {
  if (!value) return null;
  return users.find((u) => u[field] === value);
}

//setAuthCookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
