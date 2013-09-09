var csv = require('csv');
var https = require('https');
var querystring = require('querystring');

csv()
.from('CleanWithFreshman.csv', {columns: true, delimiter: '|'})
.on('record', function(row,index){
	var post_data = querystring.stringify({
		'username': row.username.toUpperCase(),
		'email': row.email,
		'altEmail': row.altEmail,
		'ppid': row.ppid,
		'name': row.name,
		'code': row.code,
		'level': row.level,
		'userType': 1,
		'profilePicture': '/img/letterprofiles/'+row.username.substring(0,1)+'.jpg',
		'retinaProfilePicture': '/img/letterprofiles/'+row.username.substring(0,1)+'.jpg',
		'password': 'pushUserPass'
	});

	var post_options = {
		host: 'www.emorybubble.com',
		port: '443',
		path: '/pushUser',
		method: 'POST',
		headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
        	'Content-Length': post_data.length
    	}
	};

	var post_req = https.request(post_options, function(res) {
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
