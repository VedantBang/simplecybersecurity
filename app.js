const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.get('/level1', (req,res,next) => {
	try{
		let { admin } = req.cookies;
		if(!admin) {
			res.cookie('admin', 'superSecretAdmin').send('You are not authorised');
		} else {
			if (admin === 'superSecretAdmin') {
			res.status(200).send('Congratulations!');
			} else {
			res.send('You are not authorised');
			}
		}
	} catch(err){ next(err); }
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