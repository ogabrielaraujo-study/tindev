const express = require('express');

const server = express();

server.get('/', (req, res) => {
	return res.send('Hello World');
});

server.listen(3333);