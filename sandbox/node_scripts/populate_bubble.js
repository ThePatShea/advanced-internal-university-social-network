var csv = require('csv');
var mongoose = require('mongoose');
var querystring = require('querystring');

mongoose.connect('mongodb://bubbleproduction:F302pinpulse@ds041848-a0.mongolab.com:41848,ds041848-a1.mongolab.com:41848/bubble_production');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
	var bubbleSchema = mongoose.Schema({
		_id: String,
		users: {
			members: [String]
		}
	});
	var userSchema = mongoose.Schema({
		_id: String,
		username: String,
		name: String
	})

	var User = mongoose.model('User', userSchema);
	var Bubble = mongoose.model('Bubble', bubbleSchema);

	var bubbleId = "sqgnzNvFyEvsgArYG";

	csv()
	.from('adpi.csv', {columns: true, delimiter: '\t'})
	.on('record', function(row,index){
		if(typeof row.netId !== "undefined")
		{
			var netId = row.netId.toUpperCase();
			//console.log("NetId: " + netId);
			User.findOne({username: netId}, function(err, res) {
				if(err) {console.log("Error on " + netId + ": " + err)}
				else {
					if(res == null)
					{
						console.log("USER NOT FOUND: " + netId);
					}
					else
					{
						Bubble.update({_id: bubbleId}, {$push: {"users.members": JSON.stringify(res._id).substring(1,JSON.stringify(res._id).length-1)}}, function(err, numAffected, raw) {
							if(err) console.log("Error on " + netId + ": " + err);
							//console.log("Response: " + JSON.stringify(raw));
						});
					}
				}
			})
		}
		else if(typeof row.name !== "undefined")
		{
			//console.log("Name: " + row.name);
			User.count({name: row.name}, function(err, count) {
				if(count == 1)
				{
					User.findOne({name: row.name}, function(err, res) {
						if(err) {console.log("Error on " + row.name + ": " + err)}
						else {
							if(res == null)
							{
								console.log("USER NOT FOUND: " + row.name);
							}
							Bubble.update({_id: bubbleId}, {$push: {"users.members": JSON.stringify(res._id).substring(1,JSON.stringify(res._id).length-1)}}, function(err, numAffected, raw) {
								if(err) console.log("Error on " + netId + ": " + err);
								console.log("Response: " + JSON.stringify(raw));
							});
						}
					})
				}
				else if(count > 1)
				{
					console.log("Multiple DB entries for: " + row.name);
				}
				else
				{
					console.log("No DB entry for: " + row.name + " | Index: " + index);
				}
			});
		}
		else
		{
			console.log("No readable cells");
		}
	})
	.on('end', function(count){
		console.log("Entries: " + count)
	})
	.on('error', function(error){
		console.log("ERROR: " + error.message);
	});
});