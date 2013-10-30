var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('Got me.');
});

console.log('Server listening on 3000');
app.listen(3000);

module.exports = app;
