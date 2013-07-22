//Exposes APIs for authentication server to check if user exists
Meteor.Router.add('/usersecret','PUT',function(){
	console.log(this.request.body);
	return [307, {'Location': 'http://127.0.0.1:8000/bubbleList'}, 'testbody'];
});

Meteor.Router.add('/authenticateduser/:secret', 'GET', function(secret){
	return [200, 'Secret: ' + secret];
});

Meteor.Router.add('/authenticateduser', 'POST', function(){
	console.log(this.request.body.username, this.request.body.secret);
});