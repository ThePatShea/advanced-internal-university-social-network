Meteor.loginAsAdmin = function(loginRequest, callback) {

  //send the login request
  Accounts.callLoginMethod({
    methodArguments: [loginRequest],
    userCallback: callback
  });
};

Template.loginDropdown.events({
  'submit form': function(event) {
  	event.preventDefault();

    var email = $(event.target).find('[name=email]').val();
    var password = $(event.target).find('[name=password]').val();

    Meteor.http.call("POST", "localhost:3000/login",
    	{data: {email:email, password:password}},
    	function(error, result){
    		// if(result.statusCode === 401){
    		// 	console.log("login failed");
    		// }
    	})

    // Meteor.loginAsAdmin(loginRequest);
   //  Accounts.callLoginMethod({
	  //   methodArguments: [loginRequest],
	  //   userCallback: callback
	  // });
	}
});