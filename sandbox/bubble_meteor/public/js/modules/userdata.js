(function(){
	UserData = {};

	var User = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/users/' + this.id;
		}
	});

	UserData.UserInfo = User;
}());