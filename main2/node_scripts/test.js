var csv = require('csv');
var http = require('http');
var querystring = require('querystring');

csv()
.from('clean.csv', {columns: true, delimiter: '|'})
.on('record', function(row,index){
	var post_data = querystring.stringify({
		'username': row.username,
		'email': row.email,
		'altEmail': row.altEmail,
		'ppid': row.ppid,
		'name': row.name,
		'code': row.code,
		'level': row.level
	});

	var post_options = {
		host: 'localhost',
		port: '3000',
		path: '/pushUser',
		method: 'POST',
		headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
        	'Content-Length': post_data.length
    	}
	};

	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk){
			console.log('Response: ' + chunk)
		});
	});

	post_req.write(post_data);
	post_req.end();

	console.log(post_data);
})
.on('end', function(count){
	console.log(count + " lines processed.");
})
.on('error', function(error){
	console.log(error.message);
});