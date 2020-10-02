const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.get('/level1', (req,res,next) => {
	try{
		let { admin } = req.cookies;
		if(!admin) {
			res.cookie('admin', 'wu2su2ee323283ye').send('You are not the superSecretAdmin that we want...');
		} else {
			if (admin === 'superSecretAdmin') {
			res.status(200).send('Congratulations! You can move on to level2 now...');
			} else {
			res.send('You are not authorised');
			}
		}
	} catch(err){ next(err); }
});

app.get('/level2', (req, res, next) => {
	try {
		const userAgent = req.header('User-Agent');
		const regex = /atc\/.* watchOS\/.* model\/Watch.*,.* hwp\/.* build\/.* .*/g;
		if(regex.test(userAgent)) {
			res.status(200).send('Yay you passed, you are an Apple watch owner! Move on to level3...')
		} else {
			res.send('You are not an apple watch user :(');
		}
	} catch (err) { next(err); }
});

app.use((err,req,res,next) => {
	console.log(err);
	res.status(200).end('Looks like something broke... let\'s try again!');
});

const http = require('http');
const server = http.createServer(app);
server.listen({
	host: '0.0.0.0',
	port: 1337
}, () => {
	console.log('Server running on http://localhost:1337');
});