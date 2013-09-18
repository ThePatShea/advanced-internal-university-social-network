Template.explorePageBackbone.created = function(){
	//var currentExploreId = window.location.pathname.split("/")[2];
	console.log("URL: ", window.location.pathname);
	es = undefined;
	Session.set("ExploreHome", "render");
	currentExploreId = 'hKPb7ZohcmJEFR78W';
	es = new BubbleData.ExploreSection({
		exploreId: currentExploreId,
		limit: 10,
		fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime']
	});
	exploreDep = new Deps.Dependency;
	es.explorePosts.on("change", function() {
		console.log("explore posts changed");
		exploreDep.changed();
	})
	es.exploreBubbles.on("change", function() {
		console.log("explore bubbles changed");
		exploreDep.changed();
	});
	es.exploreUsers.on("change", function() {
		console.log("explore users changed");
		exploreDep.changed();
	});
}

Template.explorePageBackbone.rendered = function(){
	console.log("RENDERED!");
	//es.getPage(0);
}

Template.explorePageBackbone.helpers({ 
  posts: function(){
  	exploreDep.depend();
  	if(es != undefined)
	{
	  	retVal = es.explorePosts.toJSON();
	  	bubbles = es.exploreBubbles.toJSON();
	  	console.log("Bubble JSON: ", bubbles);
	  	users = es.exploreUsers.toJSON();
	  	_.each(retVal, function(post, i) {
	  		if(post.postAsType === "bubble")
	  		{
	  			_.each(bubbles, function(bubble, j) {
	  				if(bubble.id == post.postAsId)
	  				{
	  					retVal[i].bubble = bubble;
	  				}
	  			})
	  		}
	  		if(post.postAsType === "user")
	  		{
	  			_.each(users, function(user, k) {
	  				if(user.id == post.postAsId)
	  				{
	  					retVal[i].user = user;
	  				}
	  			})
	  		}
	  	})
	  	console.log("RETVAL: ", retVal);
	    return retVal;
	}
  }, 
  exploreInfo: function(){
  	if(es != undefined)
	{
		return es.exploreInfo.toJSON();
	}
  }
});