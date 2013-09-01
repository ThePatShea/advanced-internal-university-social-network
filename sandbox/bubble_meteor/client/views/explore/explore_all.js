Template.exploreAll.rendered = function(){
	Meteor.subscribe('allExplores');
	var userType = Meteor.users.findOne({_id: Meteor.userId()}).userType;

	if(Explores.find().count() > 0){
		var firstExplore = Explores.findOne().fetch();
		Meteor.Router.to('/explore/' + firstExplore._id + '/home');
	}
	else if(userType == '4'){
		Meteor.Router.to('/explore/create');
	}
}