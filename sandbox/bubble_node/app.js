var express = require('express');
var app = express();
var stylus = require('stylus');
var path = require('path');


app.use(express.static(__dirname + '/public'));

app.use(stylus.middleware(path.resolve(__dirname, 'public')));


app.get('/', function(req, res){
	res.send('Got me.');
});

app.get('/bubbles', function(req, res){
	var bubbles = {
		'bubbles': [
			{'id': 1, 'title': 'Bubble One'},
			{'id': 2, 'title': 'Bubble Two'},
			{'id': 3, 'title': 'Bubble Three'}
		]
	}

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(bubbles));
});


console.log('Server listening on 3000');
app.listen(3000);

module.exports = app;
