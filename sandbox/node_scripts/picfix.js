var mongoose = require('mongoose');
var querystring = require('querystring');

mongoose.connect('mongodb://bubbleproduction:F302pinpulse@ds041848-a0.mongolab.com:41848,ds041848-a1.mongolab.com:41848/bubble_production');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
	var userSchema = mongoose.Schema({
		_id: String,
		username: String,
		profilePicture: String,
		retinaProfilePicture: String
	})

	var User = mongoose.model('User', userSchema);

	var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	
	for(i in letters)
	{
		var stream = User.find({profilePicture: "/img/letterprofiles/z.jpg"}).stream();
		stream.on('data', function(doc) {
			//console.log("User: " + doc.username + " ProfPic: " + doc.profilePicture);
			if(doc.username.substring(0,1).toLowerCase() != "z")
			{
				console.log("User: " + doc.username + "New pic: " + "/img/letterprofiles/"+doc.username.substring(0,1).toLowerCase()+".jpg");
				User.update({_id: doc._id}, {$set: {profilePicture: "/img/letterprofiles/"+doc.username.substring(0,1).toLowerCase()+".jpg", retinaProfilePicture: "/img/letterprofiles/" + doc.username.substring(0,1).toLowerCase() + ".jpg"}}, function(err, numAffected, raw) {
					if(err) console.log("Error : " + err);
					console.log("Response: " + JSON.stringify(raw));
				});
			}
			/*User.update({_id: doc._id}, {$set: {profilePicture: "/img/letterprofiles/"+letters[i]+".jpg", retinaProfilePicture: "/img/letterprofiles/" + letters[i] + ".jpg"}}, function(err, numAffected, raw) {
						if(err) console.log("Error : " + err);
						console.log("Response: " + JSON.stringify(raw));
					});*/
		}).on('error', function(err) {
			console.log("Error: " + err);
		}).on('close', function(){
			console.log("Finished with loop");
		})
	}
});
db.on('close', function(){
	console.log("Picfix.js complete.");
});