const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const JWTKEY = 'wdh23yd783dh8347fh4';

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/level1', (req, res, next) => {
    try {
        let { admin } = req.cookies;
        if (!admin) {
            res.cookie('admin', JWTKEY).send(
                'You are not the superSecretAdmin that we want...'
            );
        } else {
            if (admin === 'superSecretAdmin') {
                res.status(200).send(
                    'Congratulations! You can move on to level2 now...'
                );
            } else {
                res.send('You are not authorised');
            }
        }
    } catch (err) {
        next(err);
    }
});

app.get('/level2', (req, res, next) => {
    try {
        const userAgent = req.header('User-Agent');
        const regex = /atc\/.* watchOS\/.* model\/Watch.*,.* hwp\/.* build\/.* .*/g;
        if (regex.test(userAgent)) {
            res.status(200).send(
                'Yay you passed, you are an Apple watch owner! Move on to level3...'
            );
        } else {
            res.send('You are not an apple watch user :(');
        }
    } catch (err) {
        next(err);
    }
});

app.get('/level3', (req, res, next) => {
    var data = req.query;
    try {
        var s = req.query.apikey;
        if (s == undefined) {
            res.send("No that's the wrong apikey");
        } else if (s != '0112358132134') {
            res.send("Your api key doesn't match our Fibonacci 10 standard");
        } else {
            res.send('Congrats! You made your way to level 4');
        }
    } catch (e) {
        res.send("No that's the wrong apikey");
    }
});

app.get('/level4', (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, 'index.html'));
    } catch (err) {
        next(err);
    }
});

app.post('/level4/auth', (req, res, next) => {
    try {
        let { username } = req.body;
        let token = jwt.sign({ username, role: 'visitor' }, JWTKEY);
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
});

app.get('/level4/welcome', (req, res, next) => {
    try {
        let { token } = req.cookies;
        if (token) {
            const { username, role } = jwt.verify(token, JWTKEY);
            if (role === 'admin') {
                res.status(200).send(
                    'Congratulations! You passed this test...'
                );
            } else {
                res.send(`${username}, you don't have access here...`);
            }
        } else {
            res.send('Invalid token');
        }
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(200).end("Looks like something broke... let's try again!");
});

const http = require('http');
const server = http.createServer(app);
server.listen(
    {
        host: '0.0.0.0',
        port: 1337,
    },
    () => {
        console.log('Server running on http://localhost:1337');
    }
);
