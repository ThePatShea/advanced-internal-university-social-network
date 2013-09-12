var csv = require('csv');
var https = require('https');
var querystring = require('querystring');
var count = 0;

csv()
.from('freshman.csv', {columns: true, delimiter: '\t'})
.on('record', function(row,index){
	
	if((row.EMAIL.substring(row.EMAIL.indexOf('@')+1,row.EMAIL.length) == "emory.edu"))
	{
		var username = row.EMAIL.substring(0,row.EMAIL.indexOf('@')).toUpperCase();
		if(username.indexOf('.') == -1)
		{
			var post_data = querystring.stringify({
				'username': username.toUpperCase(),
				'email': row.EMAIL,
				'name': row.FIRSTNAME + row.LASTNAME,
				'userType': 1,
				'profilePicture': '/img/letterprofiles/'+username.substring(0,1).toLowerCase()+'.jpg',
				'retinaProfilePicture': '/img/letterprofiles/'+username.substring(0,1).toLowerCase()+'.jpg',
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
					//console.log('Response: ' + chunk)
				});
			});

			post_req.write(post_data);
			post_req.end();
			count++;

			console.log(post_data);
		}
	}
})
.on('end', function(c){
	console.log(count + " users input.");
})
.on('error', function(error){
	console.log(error.message);
});
