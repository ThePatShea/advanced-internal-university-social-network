var csv = require('csv');
var querystring = require('querystring');
var http = require('http');

/*
var bubbleNames = [];
var bubbleTypes = [];
var members = [];
var admins = [];
*/
var data = [];

csv()
.from('residenceHalls.csv', {columns: true, delimiter: '\t'})
.on('record', function(row,index){
	//console.log(row.Members);
	/*
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
	*/

	var mtmp = "";
	var atmp = "";
	var itmp = "";

	
	if((row.Members != null) && (typeof row.Members != "undefined") && (row.Members !== ""))
	{
		mtmp = {
			type: row.UserType,
			user: row.Members
		}
	}
	if((row.Admins != null) && (typeof row.Admins != "undefined") && (row.Admins !== ""))
	{
		atmp = {
			type: row.UserType,
			user: row.Admins
		}
	}
	if((row.Invitees != null) && (typeof row.Invitees != "undefined") && (row.Invitees !== ""))
	{
		itmp = {
			type: row.UserType,
			user: row.Invitees
		}
	}

	var newBubble = true;
	for(i in data)
	{
		if(data[i].bubbleName === row.BubbleName)
		{
			newBubble = false;
		}
	}
	if(newBubble == true)
	{
		data.push({bubbleName: row.BubbleName, bubbleType: row.BubbleType, members: [], admins: [], invitees: []});
	}

	for(i in data)
	{
		if(data[i].bubbleName === row.BubbleName)
		{
			if(mtmp != "")
			{
				data[i].members.push(mtmp);
			}
			if(atmp != "")
			{
				data[i].admins.push(atmp);
			}
			if(itmp != "")
			{
				data[i].invitees.push(itmp);
			}
		}
	}
})
.on('end', function(count){
	console.log("END!");
	/*
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
	*/


	for(i in data)
	{
		//console.log(data[i]);
		console.log(data[i].bubbleName);
		var getBubbleId_options = {
			host: 'localhost',
			port: '3000',
			path: '/getBubbleId/'+i,
			method: 'POST',
			headers: {
	        	'Content-Type': 'application/json'
	    	}
		};

		/*
		var getBubbleId_data = querystring.stringify({
			'title': data[i].bubbleName,
			'category': data[i].bubbleType,
		});
		*/

		var getBubbleId_data = JSON.stringify(data[i]);
		//console.log(getBubbleId_data);

		var getBubbleId_req = http.request(getBubbleId_options, function(res) {
				res.setEncoding('utf8');
				res.on('error', function(err) {
					console.log("HTTP ERROR: " + err.stack);
				})
				.on('data', function (dataWithId){
					console.log(dataWithId);

					var tmpData = JSON.parse(dataWithId);
					
					bubbleId = tmpData.bubbleId;

					var populateBubble_options = {
						host: 'localhost',
						port: '3000',
						path: '/populateBubble/'+bubbleId,
						method: 'POST',
						headers: {
				        	'Content-Type': 'application/json'
				    	}
					};

					var populateBubble_req = http.request(populateBubble_options, function(res, err) {
						if(err) {console.log("HTTP ERROR: " + err);}
						else
						{
							res.setEncoding('utf8');
							res.on('data', function (chunk){
								console.log(chunk);
							})
						}
					});

					populateBubble_data = tmpData;
					//console.log(JSON.stringify(tmpData));
					populateBubble_req.write(JSON.stringify(tmpData));
					populateBubble_req.end();
				});
		});

		getBubbleId_req.write(getBubbleId_data);
		getBubbleId_req.end();
	}
})
.on('error', function(err){
	console.log("ERROR: " + err);
});