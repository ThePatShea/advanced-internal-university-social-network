Template.addDomains.rendered = function() {
}

Template.addDomains.events({
	'submit form': function(evt) {
	    evt.stopPropagation();
	    evt.preventDefault();

	    var domains = $('#domains').val();

	    if((domains != ""))
	    {
		    $.ajax({
				type: "POST",
				url: "/newLogin/addDomains",
			 	data: {domainString: domains}
			})
			.done(function(msg) {
				alert( "Added to domain list: " + domains);
				console.log("RESPONSE: ", JSON.stringify(msg));
			})
			.fail(function(msg) {
				alert("ERROR: " + JSON.stringify(msg.responseText));
			});
		}
		else
		{
			alert("Please enter at least 1 domain");
		}
	}
});