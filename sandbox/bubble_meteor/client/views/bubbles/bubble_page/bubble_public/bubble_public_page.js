Template.bubblePublicPage.rendered = function(){

	var currentBubbleId = window.location.pathname.split("/")[2];
	Session.set('currentBubbleId',currentBubbleId);

	var mybubbles = new BubbleDataNew.MyBubbles({
	    bubbleId: currentBubbleId,
	    limit: 1,
	    fields: ['title', 'profilePicture', 'category', 'bubbleType','description'],
	    callback: function(bubble) {
	    	console.log("BUBBLE: ", bubble);
		    Session.set('isLoading', false);
	        Session.set('bubbleInfo', bubble);
	    }
	});
};

// Helpers
Template.bubblePublicPage.helpers({
	getCurrentBubble: function(){
		return Session.get('bubbleInfo');
	}
});