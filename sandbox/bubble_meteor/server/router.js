//Exposes APIs for authentication server to check if user exists
Meteor.Router.add('/user/:email','POST',function(email){
	console.log(email);
	//return 'ok';
	// console.log(this.request);
	//return [200, {'Location': 'http://127.0.0.1:8000/bubblelist'}];
	//this.response.location('/bubblelist');
	//console.log(this.response);
	console.log(this.request.body);
	//this.response.write('http://127.0.0.1:8000/bubblelist');
	//this.response.end();
	//return [302, {'Location': 'http://127.0.0.1:8000/bubbleList'}, 'testbody'];
	this.response.redirect('http://127.0.0.1:8000/bubbleList');
});