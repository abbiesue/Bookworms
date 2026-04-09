require('dotenv').config();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const authCookieName = 'token';
const DB = require('./database.js')
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const { BonusSet, getWordOfTheDay } = require('./Bonuses');
const http = require('http');
const { WebSocketServer } = require('ws');

//space to store all stuff that will be mapped to a database
let dailyPrompt = { date: null, text: null };

const port = process.argv.length > 2 ? process.argv[2] : 4000;

scheduleMidnightArchive(); // call once when server starts

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// ---------------LOGIN ENDPOINTS---------------
//CreateAuth - register a new user
apiRouter.post('/auth/create', async (req, res) => {
    if (await DB.getUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Email already in use' });
    } else if (await DB.getUser('username', req.body.username)) {
        res.status(409).send({ msg: 'Username already taken' });
    } else {
        const user = await createUser(req.body.username, req.body.email, req.body.password);
        setAuthCookie(res, user.token);
        res.send({ username: user.username, email: user.email });
    }
});

//GetAuth - login an existing user
apiRouter.post('/auth/login', async (req, res) => {
    const user = await DB.getUser('username', req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
        user.token = uuid.v4();
        await DB.updateUser(user); 
        setAuthCookie(res, user.token);
        return res.send({ username: user.username, email: user.email });
        }
    }
    res.status(401).send({ msg: 'Invalid username or password' });
});

//DeleteAuth - logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await DB.getUser('token', req.cookies[authCookieName]);
    if (user) {
        await DB.removeUserToken(user);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});
// ---------------------------------------------

//verifyAuth - verify a user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
    const user = await DB.getUser('token', req.cookies[authCookieName]);
    req.user = user;
    if (user){
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

//verifyResponded = verify a user has responded before calling an endpoint
const verifyResponded = async (req, res, next) => {
    const user = req.user || await DB.getUser('token', req.cookies[authCookieName]);
    if (!user) return res.status(401).send({ msg: 'Unauthorized' });

    const userResponse = await DB.getResponse(user.username);
    if (userResponse) {
        next();
    } else {
        res.status(403).send({ msg: 'User has not responded' });
    }
}

//GetAuthClean - get the currently logged in user
apiRouter.get('/auth/me', verifyAuth, (req, res) => {
    res.send({ username: req.user.username });
});

// ---------------PROMPT ENDPOINTS---------------
//GetPrompt - return the daily prompt, if it doesn't exist, call claude to get it
apiRouter.get('/prompt', verifyAuth, async(req, res) => {
    const today = new Date().toISOString().split('T')[0];
    if (dailyPrompt.date !== today) {
        try {
            const response = await client.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 300,
                messages: [
                    {
                        role: 'user',
                        content: 'Generate a single creative writing prompt for today. Make it imaginative, specific, and inspiring. Return only the prompt itself, no extra commentary.'
                    }
                ]
            });
            dailyPrompt = { date: today, text: response.content[0].text };
        } catch (e) {
            console.error('Claude API error:', e.message);
            return res.status(500).send({ msg: e.message });
        }
    }
    res.send(dailyPrompt.text);
});
// ----------------------------------------------

// ----------------BONUS ENDPOINTS---------------
//GetBonuses - gets a bonus set by user, if set does not exist, generate a new one by calling class function.
apiRouter.get('/bonus', verifyAuth, async (req, res) => {
    let bonusDoc = await DB.getUserBonuses(req.user.username);
    if (!bonusDoc) {
        const word = await getWordOfTheDay();
        const bonusSet = new BonusSet(req.user.username, word);
        bonusDoc = {
            username: bonusSet.getUsername(),
            date: bonusSet.getDate(),
            bonuses: bonusSet.getBonuses(),
        };
        await DB.updateUserBonuses(bonusDoc);
    }
    res.send(bonusDoc.bonuses);
});

//EvaluateBonuses - evaluates bonus completion by calling claude based on response text and bonus texts
apiRouter.post('/bonus/evaluate', verifyAuth, async (req, res) => {
    const response = await DB.getResponse(req.user.username);
    const bonusSet = await DB.getUserBonuses(req.user.username);
    if (response && bonusSet) {
        const bonuses = bonusSet.bonuses.map(b => b.text);
        const evaluation = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 300,
            messages: [
                {
                    role: 'user',
                    content: `Given this writing response: "${response.text}"
                        And these bonuses:
                        1. ${bonuses[0]}
                        2. ${bonuses[1]}
                        3. ${bonuses[2]}
                        Return ONLY a JSON array of exactly 3 boolean values (true/false) indicating whether each bonus was completed, in the same order. Example: [true, false, true]`
                }
            ]
        });
        try {
            const results = JSON.parse(evaluation.content[0].text);
            results.forEach((completed, index) => {
                if (bonusSet.bonuses[index] !== undefined) {
                    bonusSet.bonuses[index].completed = completed;
                }
            });
            await DB.updateUserBonuses(bonusSet);
            res.send(bonusSet.bonuses);
        } catch (e) {
            res.status(500).send({ success: false, msg: 'Failed to parse evaluation result' });
        }
    } else {
        res.status(404).send({ success: false, msg: 'Response or bonus set not found' });
    }
});

// ----------------------------------------------

// -------------RESPONSE ENDPOINTS---------------
//SubmitResponse - should not submit response if user is not logged in
apiRouter.post('/response/submit', verifyAuth, async (req, res) => {
    const { prompt, text } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const responseData = {
        username: req.user.username,
        prompt,
        text,
        date: today,
        timestamp: new Date().toISOString(),
        reactions: { likes: [], laughs: [], cries: [] },
        critiques: [],
    };
    await DB.addResponse(responseData);
    broadcast({ type: 'new_response', username: responseData.username, text: responseData.text, timestamp: responseData.timestamp });
    res.status(201).send(responseData);
});

//EditResponse - endpoint for editing the response text
apiRouter.put('/response/edit', verifyAuth, verifyResponded, async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const response = await DB.getResponse(req.user.username);
    if (response) {
        if (response.date !== today) return res.status(403).send({ msg: 'Cannot edit a previous day\'s response' });
        await DB.updateResponseText(req.user.username, req.body.text);
        broadcast({ type: 'edit_response', username: req.user.username, text: req.body.text, timestamp: new Date().toISOString() });
        res.send({ ...response, text: req.body.text });
    } else {
        res.status(404).send({ msg: 'Response not found' });
    }
});

//GetAllResponses - get all stored responses
apiRouter.get('/response/all', verifyAuth, verifyResponded, async (req, res) => {
    const allResponses = await DB.getAllTodayResponses();
    const formatted = allResponses.map(r => ({
        username: r.username,
        text: r.text,
        timestamp: r.timestamp,
        reactions: formatReactions(r.reactions, req.user.username),
        critiques: r.critiques,
    }));
    const userIdx = formatted.findIndex(r => r.username === req.user.username);
    if (userIdx > 0) {
        const [userEntry] = formatted.splice(userIdx, 1);
        formatted.unshift(userEntry);
    }
    res.send(formatted);
});

//GetUserResponse - get the response of the person logged in
apiRouter.get('/response/user', verifyAuth, async (req, res) => {
    const userResponse = await DB.getResponse(req.user.username);
    if (userResponse) {
        res.send({ responded: true, response: userResponse });
    } else {
        res.send({ responded: false });
    }
});

//AddReaction - changes the reaction 
apiRouter.post('/response/reaction', verifyAuth, verifyResponded,async (req, res) => {
    const {responseAuthor, reactionType} = req.body;
    const panel = await DB.updateResponseReaction(responseAuthor, reactionType, req.user.username);
    if (!panel) return res.status(404).send({ msg: 'Response not found' });
    sendTo(responseAuthor, { type: 'notification', message: `${req.user.username} reacted to your response! Refresh to see changes.` });
    res.status(201).send(formatReactions(panel, req.user.username));
});

//AddCritique
apiRouter.post('/response/critique', verifyAuth, verifyResponded, async (req, res) => {
    const { responseAuthor, critiqueText } = req.body;
    const critiqueObj = {
        username: req.user.username,
        text: critiqueText,
        date: new Date().toISOString(),
    }
    const critiques = await DB.addCritique(responseAuthor, critiqueObj);
    if (!critiques) return res.status(404).send({ msg: 'Response not found' });
    sendTo(responseAuthor, { type: 'notification', message: `${req.user.username} commented on your response! Refresh to see changes.` });
    res.send(critiques);
});
// ---------------------------------------------

// ---------------PROFILE ENDPOINTS-------------
//GetArchive
apiRouter.get('/archive', verifyAuth, async (req, res) => {
    const entries = await DB.getUserArchive(req.user.username);
    res.send(entries);
});
//GetProfileStats
apiRouter.get('/profile', verifyAuth, async (req, res) => {
    const archive = await DB.getUserArchive(req.user.username);
    const totalCritiques = archive.reduce((sum, entry) => sum + (entry.critiquesPosted || 0), 0);
    const totalBonuses = archive.reduce((sum, entry) => sum + (entry.bonusesCompleted || 0), 0);
    const streak = calculateStreak(archive);
    res.send({streak: streak, totalBonuses: totalBonuses, totalCritiques: totalCritiques});
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

//createUser
async function createUser(username, email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    username: username,
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);
  return user;
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

function formatReactions(panel, username) {
    const p = panel || { likes: [], laughs: [], cries: [] };
    return {
        likeCount: p.likes.length,
        laughCount: p.laughs.length,
        cryCount: p.cries.length,
        userReacted: {
            like: p.likes.includes(username),
            laugh: p.laughs.includes(username),
            cry: p.cries.includes(username),
        }
    };
}

async function archiveDay() {
    const responses = await DB.getAllTodayResponses();
    for (const response of responses) {
        const bonusSet = await DB.getUserBonuses(response.username);
        const bonusesCompleted = bonusSet ? bonusSet.bonuses.filter(b => b.completed).length:0;
        const critiquesPosted = countCritiques(responses, response.username);
        const entry = {
            username: response.username,
            date: response.date,
            prompt: response.prompt,
            text: response.text,
            bonusesCompleted,
            critiquesPosted,
        };
        await DB.addArchiveEntry(entry);
    }
    await DB.deleteTodayResponses();
    await DB.deleteTodayBonuses();
}

function countCritiques(responses, username) {
    return responses
        .flatMap(r => r.critiques || [])
        .filter(c => c.username === username)
        .length;
}

function scheduleMidnightArchive() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // next midnight
    const msUntilMidnight = midnight - now;

    setTimeout(() => {
        archiveDay();
        scheduleMidnightArchive(); // reschedule for next midnight
    }, msUntilMidnight);
}

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
}

function calculateStreak(archiveEntries) {
    const dates = new Set(archiveEntries.map(e => e.date));
    
    let streak = 0;
    let day = 1; // start from yesterday
    while (dates.has(daysAgo(day))) {
        streak++;
        day++;
    }
    return streak;
}

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on('connection', (ws) => {
    ws.username = null;

    ws.on('message', (raw) => {
        const msg = JSON.parse(raw);
        if (msg.type === 'register') {
            ws.username = msg.username;
            clients.set(msg.username, ws);
        }
    });

    ws.on('close', () => {
        if (ws.username) clients.delete(ws.username);
    });
});

function broadcast(payload) {
    const data = JSON.stringify(payload);
    for (const [, client] of clients) {
        if (client.readyState === 1) client.send(data);
    }
}

function sendTo(username, payload) {
    const client = clients.get(username);
    if (client && client.readyState === 1) {
        client.send(JSON.stringify(payload));
    }
}

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
