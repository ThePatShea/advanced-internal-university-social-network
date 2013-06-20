//Exposes APIs for authentication server to check if user exists
Meteor.Router.add('/usersecret','PUT',function(){
	console.log(this.request.body);
	return [307, {'Location': 'http://127.0.0.1:8000/bubbleList'}, 'testbody'];
});

Meteor.Router.add('/user/:username/:secret', 'GET', function(username, secret){
	return [200, 'Username: ' + username + '\nSecret: ' + secret];
});