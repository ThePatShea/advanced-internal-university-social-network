var fs = require('fs');
var http = require('http');

var start = "2013-08-01";
var end = "2013-09-01";
var path = "/bubbleanalytics?start="+ start + "&end=" + end;

var bubbleanalytics_options = {
	host: 'localhost',
	port: '3000',
	path: path,
	method: 'GET',
	headers: {
    	'Content-Type': 'application/json'
	}
};

http.get(bubbleanalytics_options, function(res) {
	console.log("STATUS: " + res.statusCode);
	res.on('data', function(chunk) {
		console.log("Body: " + chunk);
		resData = JSON.parse(chunk);
		var retVal = "Start Date,End Date,Name,Username,Level,Login Count,Post Count\n";
		for(i in resData.data)
		{
			retVal = retVal.concat(resData.startDate + "," + resData.endDate + "," + resData.data[i].name + "," + resData.data[i].username + "," + resData.data[i].level + "," + resData.data[i].loginCount + "," + resData.data[i].postCount + "\n");
		}
		console.log(retVal);
		var filename = "Analytics for " + resData.startDate + " to " + resData.endDate + ".csv";
		fs.writeFile(filename, retVal, function(err)
		{
			if(err) throw err;
			console.log("CSV created!");
			return;
		});
	});
	res.on('error', function(err) {
		console.log("HTTP ERROR: " + err.stack);
	});
});

/*var res = {
    startDate: "Wed Dec 31 1969",
    endDate: "Mon Sep 09 2013",
    data: [
        {
        	name: "Campus Bubble",
            username: "campusbubble",
            loginCount: 1850,
            postCount: 70
        },
        {
            name: "Emory Bubble",
            username: "emorybubble",
            loginCount: 1133,
            postCount: 8
        }
    ]
}*/
