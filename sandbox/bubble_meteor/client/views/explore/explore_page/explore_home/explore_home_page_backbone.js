Template.explorePageBackbone.created = function(){
	es = undefined;
}

Template.explorePageBackbone.rendered = function(){
	//var currentExploreId = window.location.pathname.split("/")[2];
	console.log("RENDERED!");
	currentExploreId = 'hKPb7ZohcmJEFR78W';
	es = new BubbleData.ExploreSection({
		exploreId: currentExploreId,
		limit: 10,
		fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime']
	});
}

Template.explorePageBackbone.helpers({ 
  posts: function(){
  	if(es != undefined)
	{
	  	retVal = es.explorePosts.toJSON();
	  	bubbles = es.exploreBubbles.toJSON();
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