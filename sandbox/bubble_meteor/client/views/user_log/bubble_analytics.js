Template.bubbleAnalytics.events({
	'click .search-btn': function(e){
		e.preventDefault();
		e.stopPropagation();
		var username = $('.search-form > .search-text').val();
		console.log('Search Username: ', username);
		Meteor.subscribe('findUsersByUsername', username, function(){
			var user = Meteor.users.findOne({'username': username});
		    console.log(user);
		});
	}
});


Template.bubbleAnalytics.helpers({
	countUsersWithMultipleLogin: function() {

		var allUsers = Meteor.users.find({}).fetch();
		var numMultipleLoginUsers = 0;
		for(var i=0; i < allUsers.length; i++){
			var userId = allUsers[i]._id;
			var numLogins = Userlogs.find({'userId': userId, login: true}).count()
			if(numLogins > 1){
				numMultipleLoginUsers = numMultipleLoginUsers + 1;
			}
		}

		return numMultipleLoginUsers;

    //return Userlogs.find({login:true}).count();
  }
});


Template.bubbleAnalytics.created = function(){
	Meteor.subscribe('allUserNames');
	Meteor.subscribe('allUserlogs');
}