var csv = require('csv');
var mongoose = require('mongoose');
var querystring = require('querystring');
var http = require('http');

var bubbleNames = [];
var bubbleTypes = [];
var members = [];
var admins = [];

csv()
.from('poptest.csv', {columns: true, delimiter: '\t'})
.on('record', function(row,index){
	var tmp = []
	if(row.BubbleName != "")
	{
		if(bubbleNames.indexOf(row.BubbleName) < 0)
		{
			bubbleNames.push(row.BubbleName);
			bubbleTypes.push(row.BubbleType);
			members[bubbleNames.indexOf(row.BubbleName)] = [];
			admins[bubbleNames.indexOf(row.BubbleName)] = [];
		}
	}
	if(row.Members != null)
	{
		members[bubbleNames.indexOf(row.BubbleName)].push(row.Members);
	}
	if(row.Admins != null)
	{
		admins[bubbleNames.indexOf(row.BubbleName)].push(row.Admins);
	}
})
.on('end', function(count){
	console.log(bubbleNames);
	console.log(bubbleTypes);
	console.log(members);
	console.log(admins);

	var type="netId";

	var getBubbleId_options = {
		host: 'localhost',
		port: '3000',
		path: '/getBubbleId',
		method: 'POST',
		headers: {
        	'Content-Type': 'application/x-www-form-urlencoded'
    	}
	};

	var populateBubble_options = {
		host: 'localhost',
		port: '3000',
		path: '/populateBubble',
		method: 'POST',
		headers: {
        	'Content-Type': 'application/x-www-form-urlencoded'
    	}
	};

	for(i in bubbleNames)
	{
		var getBubbleId_data = querystring.stringify({
			'title': bubbleNames[i],
			'category': bubbleTypes[i],
		});

		var getBubbleId_req = http.request(getBubbleId_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (bubbleId){
				console.log(bubbleId);
				for(j in members[i])
				{
					console.log("member: " + members[i][j])
					var populateBubble_data = querystring.stringify({
						'bubbleId': bubbleId,
						'user': members[i][j],
						'type': type,
						'status': "member"
					});
					var populateBubble_req = http.request(populateBubble_options, function(res) {
						res.setEncoding('utf8');
						res.on('data', function (chunk){
							console.log(chunk);
						});
					});
					populateBubble_req.write(populateBubble_data);
					populateBubble_req.end();
				}
			});
		});

		getBubbleId_req.write(getBubbleId_data);
		getBubbleId_req.end();
	};
})
.on('error', function(error){
	console.log("ERROR: " + error.message);
});