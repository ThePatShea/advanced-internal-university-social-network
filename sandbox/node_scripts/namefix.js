var csv = require('csv');
var mongoose = require('mongoose');
var querystring = require('querystring');

mongoose.connect('mongodb://bubbleproduction:F302pinpulse@ds041848-a0.mongolab.com:41848,ds041848-a1.mongolab.com:41848/bubble_production');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
	
	var userSchema = mongoose.Schema({
		_id: String,
		username: String,
		name: String,
		firstName: String,
		lastName: String
	})

	var User = mongoose.model('User', userSchema);

	/*
	var count = 0;

	var stream = User.find().stream();

	stream.on('data', function(doc) {
		if(doc.name == undefined)
		{
			console.log(doc._id);
		}
		else{
			if(doc.name.indexOf(' ') < 0)
			{
				if((doc.firstName != undefined) && (doc.lastName != undefined))
				{
				console.log("Name: " + doc.name + " | First: " + doc.firstName + " | Last: " + doc.lastName);
				count++;
					var tmp = doc.firstName + ' ' + doc.lastName;
					console.log(tmp);
					//User.update({_id: doc._id}, {$set: {name: tmp}});
				}
			}
		}
	}).on('error', function(err) {
		console.log("Error on + " + doc._id + ": " + err);
	}).on('close', function() {
		console.log("Count: " + count);
	});
	*/
	var count = 0;
	csv()
	.from('FeedWithFreshman.csv', {columns: true, delimiter: ','})
	.on('record', function(row, index) {
		User.findOne({'username': row.NetID}, function(err, res) {	
			if(res.name.indexOf(' ') < 0)
			{
				count++;
				console.log(res.username + " | " + row.First + " " + row.Last);
				//change _id: res._id to username: row.username?
				/*User.update({_id: res._id}, {$set: {name: row.First + " " + row.Last}}, function(error, response) {
					if(error) {console.log("error: " + error)}
					console.log("response: " + response);
				});*/
			}
		});
	})
	.on('end', function(c) {
		console.log("Counted: " + count);
	})
	.on('error', function(err) {
		console.log("Error: "  + err);
	});
});