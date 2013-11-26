Template.createUser.events({
	'click .create-user-submit': function(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();
	    if(($('#full-name').val() != "") && ($('#username').val() != "") && ($('#pass1').val() != ""))
	    {
		    if($('#pass1').val() == $('#pass2').val())
		    {
			    $.ajax({
					type: "POST",
					url: "newUser",
				 	data: { name: $('#full-name').val(), username: $('#username').val(), password: $('#pass1').val(), email: $('#email').val(), secret: 'superSecret'}
				})
				.done(function(msg) {
					alert( "USER CREATED!");
					$('#full-name').val("");
					$('#name').val("");
					$('#pass1').val("");
					$('#pass2').val("");
					$('#email').val("")
					console.log("User Created: ", JSON.stringify(msg));
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
			alert("NAME, USERNAME, AND PASSWORD ARE REQUIRED");
		}
	}
});