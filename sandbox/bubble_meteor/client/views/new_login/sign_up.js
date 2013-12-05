Template.signUp.rendered = function() {
	if(Session.get('signUpEmail'))
		$('#email').val(Session.get('signUpEmail'))
}

Template.signUp.events({
	'submit form': function(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();

	    var name = $('#full-name').val();
	    var email = $('#email').val();
	    var pass1 = $('#pass1').val();
	    var pass2 = $('#pass2').val();
	    var type = $('#type').val();

	    if((name != "") && (email != "") && (pass1 != ""))
	    {
		    if(pass1 == pass2)
		    {
			    $.ajax({
					type: "POST",
					url: "/newLogin/newUser",
				 	data: { name: name, email: email, pass1: pass1, pass2: pass2, type: type}
				})
				.done(function(msg) {
					alert( "Check " + email + " to verify account!");
					$('#full-name').val("");
					$('#type').val("");
					$('#pass1').val("");
					$('#pass2').val("");
					$('#email').val("")
					console.log("User Signed Up: ", JSON.stringify(msg));
				})
				.fail(function(msg) {
					alert(JSON.stringify(msg.responseText));
				});
			}
			else
			{
				alert("PASSWORDS DO NOT MATCH!");
			}
		}
		else
		{
			alert("NAME, EMAIL, AND PASSWORD ARE REQUIRED");
		}
	}
});