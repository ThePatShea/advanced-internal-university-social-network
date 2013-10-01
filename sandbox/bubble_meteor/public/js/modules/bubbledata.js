(function(){
	BubbleData = {};
	
	var ExplorePost = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/posts/' + this.id;
		},
		initialize: function(){
			console.log("ExplorePost Model initiated", this.id);
			console.log("THIS: ", this);
		}
	});

	var ExploreBubble = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/bubbles/' + this.id;
		}
	});

	var ExploreUser = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/users/' + this.id;
		}
	});
	var ExploreInfo = Backbone.Model.extend({
		url: function(){
			console.log('/2013-09-11/explores/' + this.exploreId)
			return '/2013-09-11/explores?fields=title,description,submited,lastUpdated,exploreType,exploreIcon/' + this.exploreId;
		}
	});


	var ExplorePosts = Backbone.Collection.extend({
		exploreId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: ExplorePost,
		url: function(){
			// var fieldString = '';
			// _.each(this.fields, function(field){
			// 	fieldString = fieldString + field + ',';
			// });
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/explores/' + this.exploreId + '/posts?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/explores/' + this.exploreId + '/posts?fields=name/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			_.each(response.posts, function(item){
				if(item.postType !== "file")
				{
					listObjects.push(item);
				}
			});
			return listObjects;
		}
	});


	var ExploreUsers = Backbone.Collection.extend({
		model: ExploreUser,
		initialize: function(){
			this.watch = function(collection){
				var that = this;
				collection.on('add', function(model){
					var serverModel = model.toJSON();
					if(serverModel.postAsType == 'user'){
						var newUser = new ExploreUser({id: serverModel.postAsId});
						newUser.fetch({
							success: function(){
								exploreDep.changed();
							}
						});
						that.add(newUser);
					}
				});
			}
		}
	});

	var ExploreBubbles = Backbone.Collection.extend({
		model: ExploreBubble,
		initialize: function(){
			this.watch = function(collection){
				var that = this;
				collection.on('add', function(model){
					var serverModel = model.toJSON();
					if(serverModel.postAsType == 'bubble'){
						var newBubble = new ExploreBubble({id: serverModel.postAsId});
						newBubble.fetch({
							success: function(){
								exploreDep.changed();
							}
						});
						that.add(newBubble);
					}
				});
			}
		}
	});

	var BubbleInfo = Backbone.Model.extend({
		url: function(){
			console.log('/2013-09-11/bubbles/' + this.bubbleId)
			return '/2013-09-11/bubbles?fields=title,description,submited,lastUpdated,profilePicture/' + this.bubbleId;
		}
	});

	var BubblePost = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/posts/' + this.id;
		}
	});

	var BubbleUser = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/users/' + this.id;
		}
	});

	var BubblePosts = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: BubblePost,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/posts?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/posts?fields=name/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			_.each(response.posts, function(item){
				listObjects.push(item);
			});
			return listObjects;
		}
	});

	var BubbleUsers = Backbone.Collection.extend({
		model: BubbleUser,
		initialize: function(){
			this.watch = function(collection){
				var that = this;
				collection.on('add', function(model){
					var serverModel = model.toJSON();
					console.log('Servermodel userId: ', serverModel.userId);
					var newUser = new BubbleUser({id: serverModel.userId});
					newUser.fetch();
					that.add(newUser);
				});
			}
		}
	});

	var BubbleMembers = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: ['username', 'name', 'profilePicture'],
		model: BubbleUser,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/members?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/members?fields=name/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			_.each(response.members, function(item){
				listObjects.push(item);
			});
			return listObjects;
		}
	});

	var BubbleAdmins = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: ['username', 'name', 'profilePicture'],
		model: BubbleUser,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/admins?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/admins?fields=name/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			_.each(response.admins, function(item){
				listObjects.push(item);
			});
			return listObjects;
		}
	});

	var BubbleApplicants = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: ['username', 'name', 'profilePicture'],
		model: BubbleUser,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/applicants?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/applicants?fields=name/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			_.each(response.applicants, function(item){
				listObjects.push(item);
			});
			return listObjects;
		}
	});


	var BubbleInvitees = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: ['username', 'name', 'profilePicture'],
		model: BubbleUser,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/invitees?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/invitees?fields=name/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			_.each(response.invitees, function(item){
				listObjects.push(item);
			});
			return listObjects;
		}
	});

	var MyBubbles = function(properties){
		var that = this;

		var EventPosts = function() {

		};

		var DiscussionPosts = function() {

		};

		var FilePosts = function() {

		};

		var Members = function() {

		};

		var Admins = function() {

		};

		var Applicants = function() {

		};

		var Invitees = function() {

		};
		
		this.bubblePosts = new BubblePosts();
		this.bubbleUsers = new BubbleUsers();
		this.bubbleMembers = new BubbleMembers();
		this.bubbleUsers.watch(this.bubblePosts);

		this.bubblePosts.bubbleId = properties.bubbleId;
		this.bubblePosts.limit = properties.limit;
		this.bubblePosts.fields = properties.fields;
		this.bubblePosts.fetch();

		this.bubbleMembers.bubbleId = properties.bubbleId;
		this.bubbleMembers.fetch();

		this.bubbleInfo = new BubbleInfo();
		this.bubbleInfo.bubbleId = properties.bubbleId;
		this.bubbleInfo.fetch();

		this.fetchPage = function(page, callback){
			if(page == undefined) {page = that.bubblePosts.page};
			if(page >= that.bubblePosts.pages) {page = that.bubblePosts.pages-1};
			if(page < 0) {page = 0};
			that.bubblePosts.page = page;
			that.bubblePosts.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(page);
						}
					}
				});
			return page;
		};

		this.fetchNextPage = function(callback){
			if(that.bubblePosts.page < that.bubblePosts.pages-1){
				that.bubblePosts.page = that.bubblePosts.page + 1;
				that.bubblePosts.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(that.bubblePosts.page);
						}
					}
				});
			}
		};

		this.fetchPrevPage = function(callback){
			if(that.bubblePosts.page > 0){
				that.bubblePosts.page = that.bubblePosts.page - 1;
				that.bubblePosts.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(that.bubblePosts.page);
						}
					}
				});
			}
		};

		this.getCurrentPage = function(){
			return that.bubblePosts.page;
		};

		this.getNumPages = function(){
			return that.bubblePosts.pages;
		};

		this.setFields = function(fieldsString){
			if(fieldString === "long")
			{
				fields = [];
			}
			else if(fieldString === "medium")
			{
				fields = [];
			}
			else if(fieldString === "short")
			{
				fields = [];
			}
			else
			{
				fields = fieldString.split(",");
			}
			that.bubblePosts.fields = fields;
			return fields;
		};

		this.setLimit = function(limit){
			that.bubblePosts.limit = limit;
			return limit;
		}


		this.fetchMembersPage = function(page, callback){
			if(page == undefined) {page = that.bubbleMembers.page};
			if(page >= that.bubbleMembers.pages) {page = that.bubbleMembers.pages-1};
			if(page < 0) {page = 0};
			that.bubbleMembers.page = page;
			that.bubbleMembers.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(page);
						}
					}
				});
			return page;
		};

		this.fetchNextMembersPage = function(callback){
			if(that.bubbleMembers.page < that.bubbleMembers.pages-1){
				that.bubbleMembers.page = that.bubbleMembers.page + 1;
				that.bubbleMembers.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(that.bubbleMembers.page);
						}
					}
				});
			}
		};

		this.fetchPrevMembersPage = function(callback){
			if(that.bubbleMembers.page > 0){
				that.bubbleMembers.page = that.bubbleMembers.page - 1;
				that.bubbleMembers.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(that.bubbleMembers.page);
						}
					}
				});
			}
		};

		this.getCurrentMembersPage = function(){
			return that.bubbleMembers.page;
		};

		this.getNumMembersPages = function(){
			return that.bubbleMembers.pages;
		};

		this.setMembersFields = function(fieldsString){
			if(fieldString === "long")
			{
				fields = [];
			}
			else if(fieldString === "medium")
			{
				fields = [];
			}
			else if(fieldString === "short")
			{
				fields = [];
			}
			else
			{
				fields = fieldString.split(",");
			}
			that.bubbleMembers.fields = fields;
			return fields;
		};

		this.setMembersLimit = function(limit){
			that.bubbleMembers.limit = limit;
			return limit;
		}


		this.setBubble = function(id){
			if(id != undefined)
			{
				that.bubbleId = id;
				return id;
			}
			else
			{
				that.bubbleId = this.bubbleId;
				return;
			}
		}
	}

	var ExploreSection = function(properties){
		var that = this;

		this.explorePosts = new ExplorePosts();
		this.exploreUsers = new ExploreUsers();
		this.exploreUsers.watch(this.explorePosts);
		this.exploreBubbles = new ExploreBubbles();
		this.exploreBubbles.watch(this.explorePosts);

		this.explorePosts.exploreId = properties.exploreId;
		this.explorePosts.limit = properties.limit;
		this.explorePosts.fields = properties.fields;
		this.explorePosts.fetch();

		this.exploreInfo = new ExploreInfo();
		this.exploreInfo.exploreId = properties.exploreId;
		this.exploreInfo.fetch();

		this.fetchPage = function(page, callback){
			if(page == undefined) {page = that.explorePosts.page};
			if(page >= that.explorePosts.pages) {page = that.explorePosts.pages-1};
			if(page < 0) {page = 0};
			that.explorePosts.page = page;
			that.explorePosts.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(page);
						}
					}
				});
			return page;
		};

		this.fetchNextPage = function(callback){
			if(that.explorePosts.page < that.explorePosts.pages-1){
				that.explorePosts.page = that.explorePosts.page + 1;
				that.explorePosts.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(that.explorePosts.page);
						}
					}
				});
			}
		};

		this.fetchPrevPage = function(callback){
			if(that.explorePosts.page > 0){
				that.explorePosts.page = that.explorePosts.page - 1;
				that.explorePosts.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(that.explorePosts.page);
						}
					}
				});
			}
		};

		this.getCurrentPage = function(){
			return that.explorePosts.page;
		};

		this.getNumPages = function(){
			return that.explorePosts.pages;
		};

		this.setFields = function(fieldsString){
			if(fieldString === "long")
			{
				fields = [];
			}
			else if(fieldString === "medium")
			{
				fields = [];
			}
			else if(fieldString === "short")
			{
				fields = [];
			}
			else
			{
				fields = fieldString.split(",");
			}
			that.explorePosts.fields = fields;
			return fields;
		};

		this.setLimit = function(limit){
			that.explorePosts.limit = limit;
			return limit;
		}

		this.setExplore = function(id){
			if(id != undefined)
			{
				that.exploreId = id;
				return id;
			}
			else
			{
				that.exploreId = this.exploreId;
				return;
			}
		}
	};

	var ExplorePostPage = function(id, callback){
		this.explorePost = new ExplorePost();
		this.explorePost.id = id;
		this.explorePost.fetch({
			async: false,
			success: function() {
				if(callback && typeof callback == "function")
				{
					callback();
				}
			}
		});

		// this.getBubbleTitle = function(callback){
		// 	this.exploreBubble = new ExploreBubble();
		// 	this.post = this.explorePost.toJSON();
		// 	this.exploreBubble.id = this.post.postAsId;
		// 	this.exploreBubble.fetch({
		// 		success: function() {
		// 			if(callback && typeof callback == "function")
		// 			{
		// 				callback();
		// 			}
		// 		}
		// 	});
		// };
	};

	BubbleData.ExplorePostPage = ExplorePostPage;
	BubbleData.ExploreSection = ExploreSection;
	BubbleData.ExploreUsers = ExploreUsers;
	BubbleData.ExploreBubbles = ExploreBubbles;
	BubbleData.MyBubbles = MyBubbles;

}());