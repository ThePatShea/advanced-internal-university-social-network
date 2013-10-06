Template.exploreAll.rendered = function(){
	Meteor.subscribe('allExplores', function(){
		var userType = Meteor.users.findOne({_id: Meteor.userId()}).userType;

		if(Explores.find().count() > 0){
			//var firstExplore = Explores.findOne().fetch();
			var explores = Explores.find({}, {sort: {'submitted': 1}}).fetch();
			var firstExplore = explores[0];
			console.log(firstExplore);
			Meteor.Router.to('/explore/' + firstExplore._id + '/home');
		}
		else if(userType == '4'){
			Meteor.Router.to('/create/explore');
		}
	});
}