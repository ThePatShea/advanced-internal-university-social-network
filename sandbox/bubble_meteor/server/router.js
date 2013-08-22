//Exposes APIs for authentication server to check if user exists
Meteor.Router.add('/usersecret','PUT',function(){
	console.log(this.request.body);
	return [307, {'Location': 'http://127.0.0.1:8000/bubbleList'}, 'testbody'];
});

/*Meteor.Router.add('/authenticateduser/:secret', 'GET', function(secret){
	var authenticatedUser = Meteor.users.findOne({'secret': secret});
	Accounts.loginWithPassword(authenticatedUser.username, 'ziggystardust1234', function(error){
		console.log('Error', error);
	});
	return [200, 'Secret: ' + secret];
});*/

Meteor.Router.add('/authenticateduser', 'POST', function(){
	//console.log(this.request.body.username, this.request.body.secret);
	var secret = this.request.body.secret;
	var username = this.request.body.username;
	var user = Meteor.users.findOne({username: this.request.body.username});
	if(!user){
		Accounts.createUser({'username': username, 'password': secret});
	};

	user = Meteor.users.findOne({username: this.request.body.username});
	Accounts.setPassword(user._id, secret);
	
	var userProperties = {
		'secret': secret
	};
	Meteor.users.update(user._id, {$set: userProperties});
	//console.log('User: ', user._id, secret);

	return [200, {'userid': user._id}, null];
});


Meteor.Router.add('/resetpass/:username', 'GET', function(username){
	var user = Meteor.users.findOne({'username': username});
	Accounts.setPassword(user._id, 'F302pinpulse');
	return [200, ' '];
});


Meteor.Router.add('/testauth', 'POST', function(){
	//console.log(this.request.body.username, this.request.body.secret);
	//var secret = this.request.body.secret;
	//var username = this.request.body.username;
	var netId = this.request.body.netId;
	var ppId = this.request.body.ppId;
	var lastName = this.request.body.lastName;
	var firstName = this.request.body.firstName;
	var isFerpa = this.request.body.isFerpa;
	var emoryEmail = this.request.body.emoryEmail;
	var altMail = this.request.body.altMail;
	var altEmail = this.request.body.altEmail;
	var secret = this.request.body.secret;

	console.log(netId, ppId, lastName, firstName, isFerpa, emoryEmail, altMail, altEmail);

	var user = Meteor.users.findOne({username: this.request.body.netId});
	if(!user){
		Accounts.createUser({'username': this.request.body.netId, 'password': secret});

		user = Meteor.users.findOne({username: this.request.body.netId});
		Accounts.setPassword(user._id, secret);

		var letterProfile = '/img/letterprofiles' + this.request.body.netId.toLowerCase()[0] + '.jpg';
		
		var userProperties = {
			'profilePicture': letterProfile,
			'userType': 1,
			'ppId': ppId,
			'lastName': lastName,
			'firstName': firstName,
			'isFerpa': isFerpa,
			'emoryEmail': emoryEmail,
			'altMail': altMail,
			'altEmail': altEmail,
			'name': firstName + ' ' + lastName
			//'secret': secret
		}

		Meteor.users.update(user._id, {$set: userProperties});
	}
	else{
		Accounts.setPassword(user._id, secret);
		var updatedUserProperties = {
			'ppId': ppId,
			'lastName': lastName,
			'firstName': firstName,
			'isFerpa': isFerpa,
			'emoryEmail': emoryEmail,
			'altMail': altMail,
			'altEmail': altEmail,
			'name': firstName + ' ' + lastName
			//'secret': secret
		}

		Meteor.users.update(user._id, {$set: updatedUserProperties});
	}


	return [200, {'body': JSON.stringify(this.request.body)}, null];
});


/*Meteor.Router.add('/testauth/:username/:secret', 'GET', function(username, secret){
	var user = Meteor.users.findOne({'username': username, 'secret': secret});
	var usercount = Meteor.users.find({'username': username, 'secret': secret}).count();
	console.log(username, secret, user);
	if(usercount > 0){
		console.log('User secret checks out.');
		//Meteor.loginWithPassword(username, 'F302pinpulse');
		//return [302, {'Location': 'https://test.emorybubble.com'}];
		//return [200, 'Username: ' + username + '\nSecret: ' + secret];
		//Meteor.Router.to('/');
		Accounts.callLoginMethod({
			methodArguments: [{'user': user, 'password': 'F302pinpulse'}]
		});
		return [200, 'Username: ' + username + '\nSecret: ' + secret];
	}
	else{
		return [404];
	}

	//return [302, {'Location': 'https://test.emorybubble.com'}];

	//return [200, 'Username: ' + username + '\nSecret: ' + secret];
});*/

/*
// Xavier: This commented-out stuff is from conflict with merge to pat branch. I didn't know what to do with it, so I commented it out so you can do what you want with it.   --Pat

 
Meteor.Router.add('/user/:username/:secret', 'GET', function(username, secret){
	return [200, 'Username: ' + username + '\nSecret: ' + secret];
});


Meteor.Router.add('/','GET', function(){
	return [307, {'Location': 'http://main.campusbubble.jit.su'}, 'null'];
});
*/

Meteor.Router.add('/pushUser', 'POST', function() {
	var email = this.request.body.email;
	var altEmail = this.request.body.altEmail;
	var name = this.request.body.name;
	var ppid = this.request.body.ppid;
	var username = this.request.body.username;
	var code = this.request.body.code;
	var level = this.request.body.level;
	var userType = this.request.body.userType;
	var profilePicture = this.request.body.profilePicture;
	var retinaProfilePicture = this.request.body.retinaProfilePicture;
	var neverLoggedIn = true;
	var password = this.request.body.password;

	if(password == "pushUserPass")
	{
		var user = Meteor.users.findOne({'username': username});
		if(!user)
		{
			Meteor.users.insert({'username': username})
		}
		else
		{
			console.log("User already exists: " + username);
		}

		user = Meteor.users.findOne({'username': username});

		var userProperties = {
			'ppid': ppid,
			'emails': [{
				'address': email,
				'verified': false
			}],
			'altEmails': [{
				'address': altEmail,
				'verified': false
			}],
			'name': name,
			'code': code,
			'level': level,
			'userType': userType,
			'profilePicture': profilePicture,
			'retinaProfilePicture': retinaProfilePicture,
			'neverLoggedIn': neverLoggedIn
		};
		Meteor.users.update(user._id, {$set: userProperties});

		return [200, "Success"];
	}
	else
	{
		return [403, "Forbidden"];
	}
});

Meteor.Router.add('/dailyDigest', 'POST', function(){
	secret = this.request.body.secret;
	var to = []
	var updatesRes = []
	if(secret == "F302pinpulse")
	{
		var fullUpdateList = compressUpdates();
		console.log(fullUpdatesList);
        //Pulling the userId out for the 1st layer
        var userIdList = Object.keys(fullUpdateList);
        _.each(userIdList, function(userId){
          var emailUpdateList = {};
          var bubbleUpdateList = fullUpdateList[userId];
          //Pulling the bubbleId out for the 2nd layer
          var bubbleIdList = Object.keys(bubbleUpdateList);
          //Iterate through the 3rd layer of updates
          _.each(bubbleIdList, function(bubbleId){
            var updateList = bubbleUpdateList[bubbleId]; 
            //Edit the content for update types that does compiling
            var bubbleUpdateTypeList = 
              [ 
                "new applicant",
                "new attendee",        
                "member promoted",
                "member demoted",
                "joined bubble"
              ];
            _.each(updateList, function(update){
              if(update.updateType == 'replied'
                || _.contains(bubbleUpdateTypeList,update.updateType)) {
                update.content = update.invokerName + update.content;
              }
            });
            var contentList = _.pluck(updateList,'content');
            var bubble = Bubbles.findOne(bubbleId);
            emailUpdateList[bubble.title] = contentList;
          });
          var user = Meteor.users.findOne(userId);

          to.push(user.emails[0].address);
          updatesRes.push(emailUpdateList);
          console.log("to: " + to);
          console.log("updates" + to);

      	Updates.update({read:false, emailed:false}, {$set:{emailed:true}});
		});
		return [200, "Hurray"]
	}
	else
	{
		return [403, "Forbidden"]
	}
})

compressUpdates = function() {
  var fullUpdateList = Updates.find({read: false, emailed: false }).fetch();
  var userUpdateList = _.toArray(_.groupBy(fullUpdateList,'userId'));
  var finalUpdateDic = {};

  _.each(userUpdateList, function(updateList){
    var userId = updateList[0].userId;
    //To combine updates with same userId, invokerId, updateType and postId
    if(updateList.length > 0) {
      //To combine updates with same userId, invokerId, updateType and postId
      _.each(updateList, function(update){
        updateList = _.reject(updateList, function(newUpdate) {
          return  update.bubbleId == newUpdate.bubbleId && 
                  update.userId == newUpdate.userId && 
                  update.invokerId == newUpdate.invokerId && 
                  update.updateType == newUpdate.updateType &&
                  update.postId == newUpdate.postId;
        });
        if(!_.contains(updateList,update)){
          updateList.push(update);
        }
      });

      /**
      * To combine updates for comments in the same post
      **/
      _.each(updateList, function(update){

        var commentUpdates = _.reject(updateList, function(update) {
          return update.updateType != "replied";
        });

        //Combine and chain the names together
        if (commentUpdates.length > 0) {
          updateList = _.reject(updateList, function(newUpdate) {
            return update.postId == newUpdate.postId && 
                    update.updateType == newUpdate.updateType &&
                    update.updateType == "replied";
          });
          if(!_.contains(updateList,update)) {
            //Pull out comment updates that belong to the same post
            singleTypeUpdates = _.reject(commentUpdates, function(newUpdate) {
              return update.postId != newUpdate.postId;
            });
            if (singleTypeUpdates.length > 0) {
              //Create the chained name
              var nameArray = _.pluck(singleTypeUpdates,"invokerName");
              var chainedName = nameArray.join();
              var maxLength = 13;

              //Checks to see if the length of names exceed a certain limit
              if(chainedName.length > maxLength) {
                chainedName = chainedName.substring(0,maxLength);
                var nameList = chainedName.split(',');
                if(nameArray[0].length > maxLength) {
                  nameList[0] = nameArray[0];
                }else{
                  nameList.pop();
                }
                var excessCount = nameArray.length - nameList.length;
                chainedName = nameList.join();
                if(excessCount == 1) {
                  chainedName = chainedName + " and " + excessCount + " other";
                }else if(excessCount > 1){
                  chainedName = chainedName + " and " + excessCount + " others";
                }
              }else{
                chainedName = chainedName.replace(/,([^,]*)$/," and $1");
              }

              //Add the chained name to the invokerName
              update.invokerName = chainedName;
            }
            updateList.push(update);
          }
        }
      });

      //Declaring the types that needs collapsing of names
      var bubbleUpdateList = 
      [ 
        "new applicant",
        "new attendee",        
        "member promoted",
        "member demoted",
        "joined bubble"
      ]

      /**
      *  To combine and chain up names for compressed updates
      **/
      _.each(bubbleUpdateList, function(type) {
        var singleTypeUpdates = _.reject(updateList, function(update) {
          return update.updateType != type;
        });
        if (singleTypeUpdates.length > 0) {
          var nameArray = _.pluck(singleTypeUpdates,"invokerName");
          var chainedName = nameArray.join();
          var maxLength = 13;

          if(chainedName.length > maxLength) {
            chainedName = chainedName.substring(0,maxLength);
            var nameList = chainedName.split(',');
            if(nameArray[0].length > maxLength) {
              nameList[0] = nameArray[0];
            }else{
              nameList.pop();
            }
            var excessCount = nameArray.length - nameList.length;
            chainedName = nameList.join();
            if(excessCount == 1) {
              chainedName = chainedName + " and " + excessCount + " other";
            }else{
              chainedName = chainedName + " and " + excessCount + " others";
            } 
          }else{
            chainedName = chainedName.replace(/,([^,]*)$/," and $1");
          }

          //First retrieve applicant
          var firstUpdate = _.find(updateList, function(update) {
            update.invokerName = chainedName;
            return update.updateType == type
          });
          // Next remove all applicants
          updateList = _.reject(updateList, function(newUpdate) {
            return newUpdate.updateType == type;
          });
          //Now ad back with the applicant that has a changed invoker name
          if(firstUpdate){
            updateList.push(firstUpdate);
          }
        }
      });

      updateList = _.sortBy(updateList, function(newUpdate) {
        return newUpdate.submitted; 
      }); 

      finalUpdateDic[userId] = _.groupBy(updateList,'bubbleId');
    }
  });
  return finalUpdateDic;
}