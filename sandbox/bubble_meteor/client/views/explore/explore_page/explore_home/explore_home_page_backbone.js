Template.explorePageBackbone.created = function(){
  	Session.set("isLoading", true);
	//currentExploreId = window.location.pathname.split("/")[2];
	//currentExploreId = 'hKPb7ZohcmJEFR78W';
	//currentExploreId = Session.get("currentExploreId");
	exploreDep = new Deps.Dependency;
	es = undefined;
	currentExploreId = undefined;
	// es = new BubbleData.ExploreSection({
	// 	exploreId: currentExploreId,
	// 	limit: 10,
	// 	fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime']
	// });
	// es.explorePosts.on("change", function() {
	// 	console.log("explore posts changed");
	// 	exploreDep.changed();
	// })
	// es.exploreBubbles.on("change", function() {
	// 	console.log("explore bubbles changed");
	// 	exploreDep.changed();
	// });
	// es.exploreUsers.on("change", function() {
	// 	console.log("explore users changed");
	// 	exploreDep.changed();
	// });
}

Template.explorePageBackbone.rendered = function(){
	console.log("RENDERED!");
	//es.getPage(0);
	if(currentExploreId != window.location.pathname.split("/")[2])
	{
		currentExploreId = window.location.pathname.split("/")[2];
		es = new ExploreData.ExploreSection({
			exploreId: currentExploreId,
			limit: 10,
			fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime', 'children','commentsCount','attendees']
		});
		es.fetchPage(es.getCurrentPage(), function() {
			Session.set("isLoading", false);
		});
		/*es.explorePosts.on("change", function() {
			console.log("explore posts changed");
			exploreDep.changed();
		});
		es.exploreBubbles.on("change", function() {
			console.log("explore bubbles changed");
			exploreDep.changed();
      		Session.set("isLoading", false);
		});
		es.exploreUsers.on("change", function() {
			console.log("explore users changed");
			exploreDep.changed();
      		Session.set("isLoading", false);
		});*/
	}
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
  pages: function() {
  	var retVal = []
	if(es != undefined)
	{
		for(var i=0; i<es.getNumPages(); i++)
		{
			retVal.push(i+1);
		}
	}
	else
	{
		retVal = [1];
	}
	return retVal;
  },
  isActivePage: function() {
	if(es != undefined)
	{
	  	if(this == es.getCurrentPage()+1)
	  	{
	  		return "active";
	  	}
	}
  	return "";
  },
  exploreInfo: function(){
  	if(es != undefined)
	{
		return es.exploreInfo.toJSON();
	}
  },
  getExploreId: function(){
  	return Session.get("currentExploreId");
  }
});

Template.explorePageBackbone.events({
	'click .pageitem': function(e) {
		console.log("PAGEITEM: ", e.target.id);
		es.fetchPage(parseInt(e.target.id)-1, function(res){
			exploreDep.changed();
			console.log("CALLED", res);
		});
	},
	'click .prev': function() {
		es.fetchPrevPage(function(res){
			exploreDep.changed();
			console.log("CALLED", res);
		});
		//var currentPage = es.getCurrentPage();
		//es.fetchPage(currentPage - 1);
		// es.explorePosts.on("change", function() {
		// 	console.log("explore posts changed");
		// 	exploreDep.changed();
		// });
		
	},
	'click .next': function() {
		es.fetchNextPage(function(res){
			exploreDep.changed();
			console.log("CALLED", res);
		});
	}
});