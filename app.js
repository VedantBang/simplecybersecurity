const express = require('express');
const app = express();

app.get('/level1', (req,res,next) => {
	try{
		res.status(200).end("Welcome to level 1!");
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