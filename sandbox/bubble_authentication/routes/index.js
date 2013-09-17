var https = require('https');
var fs = require('fs');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.analytics = function(req, res){
	if(req.query.start)
	{
		var start = req.query.start;
		console.log("START: " + start);
	}
	else
	{
		var start = "";
	}
	if(req.query.end)
	{
		var end = req.query.end;
		console.log("END: " + end);
	}
	else
	{
		var end = "";
	}
	var path = "/bubbleanalytics?start="+ start + "&end=" + end;

	var bubbleanalytics_options = {
		host: 'test.emorybubble.com',
		port: '443',
		path: path,
		method: 'GET',
		headers: {
	    	'Content-Type': 'application/json'
		}
	};

	https.get(bubbleanalytics_options, function(HTTPres) {
		console.log("STATUS: " + HTTPres.statusCode);
		HTTPres.on('data', function(chunk) {
			console.log("Body: " + chunk);
			resData = JSON.parse(chunk);
			var retVal = "Start Date,End Date,Name,Username,Level,Login Count,Post Count\n";
			for(i in resData.data)
			{
				retVal = retVal.concat(resData.startDate + "," + resData.endDate + "," + resData.data[i].name + "," + resData.data[i].username + "," + resData.data[i].level + "," + resData.data[i].loginCount + "," + resData.data[i].postCount + "\n");
			}
			console.log(retVal);
			var filename = "bubbleanalytics.csv";
			fs.writeFile(filename, retVal, function(err)
			{
				if(err) throw err;
				
				console.log("CSV CREATED!");
				res.writeHead(200, {'Content-Type': "text/csv"});
				fileStream = fs.createReadStream(filename);
				fileStream.pipe(res);
				return;
			});
		});
		HTTPres.on('error', function(err) {
			console.log("HTTP ERROR: " + err.stack);
		});
	});
}