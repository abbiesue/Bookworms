const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

//space to store all stuff that will be mapped to a database
let users = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// ---------------ENDPOINTS---------------
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
// ---------------------------------------

//verifyAuth - verify a user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

//basic error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

//return basic page if path unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

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
