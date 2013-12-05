Template.betaInvite.rendered = function() {
}

Template.betaInvite.events({
	'submit form': function(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();

	    var emails = $('#emails').val();
	    var fromName = Meteor.user().name;

	    if((emails != ""))
	    {
		    $.ajax({
				type: "POST",
				url: "/newLogin/inviteMembers",
			 	data: {emailString: emails, fromName: fromName}
			})
			.done(function(msg) {
				alert("RESPONSE: ", JSON.stringify(msg));
			})
			.fail(function(msg) {
				alert("ERROR: " + JSON.stringify(msg.responseText));
			});
		}
		else
		{
			alert("Please enter at least 1 email");
		}
	}
});