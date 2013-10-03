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

	//Sync version of ExploreUsers
	var DashboardUsers = Backbone.Collection.extend({
		model: ExploreUser,
		initialize: function(){
			this.watch = function(collection){
				var that = this;
				collection.on('add', function(model){
					var serverModel = model.toJSON();
					if(serverModel.postAsType == 'user'){
						var newUser = new ExploreUser({id: serverModel.postAsId});
						newUser.fetch({async: false});
						that.add(newUser);
					}
				});
			}
		}
	});

	//Sync version of ExploreBubbles
	var DashboardBubbles = Backbone.Collection.extend({
		model: ExploreBubble,
		initialize: function(){
			this.watch = function(collection){
				var that = this;
				collection.on('add', function(model){
					var serverModel = model.toJSON();
					if(serverModel.postAsType == 'bubble'){
						var newBubble = new ExploreBubble({id: serverModel.postAsId});
						newBubble.fetch({async: false});
						that.add(newBubble);
					}
				});
			}
		}
	});

	var DashboardPosts = Backbone.Collection.extend({
		model: ExplorePost,
		url: function(){
			return '/2013-09-11/dashboard';
		}
	})

	var Dashboard = function() {
		this.dashboardUsers = new DashboardUsers();
		this.dashboardBubbles = new DashboardBubbles();
		this.dashboardPosts = new DashboardPosts();

		this.dashboardUsers.watch(this.dashboardPosts);
		this.dashboardBubbles.watch(this.dashboardPosts);

		this.dashboardPosts.fetch({async: false});

		this.getBubbles = new getJSONHelper(this.dashboardBubbles);
		this.getUsers = new getJSONHelper(this.dashboardUsers);
		this.getPosts = new getJSONHelper(this.dashboardPosts);

		//return this.dashboardPosts.toJSON();
	}

	BubbleData.Dashboard = Dashboard;

	var BubbleInfo = Backbone.Model.extend({
		url: function(){
			console.log('/2013-09-11/bubbles/' + this.bubbleId)
			return '/2013-09-11/bubbles?fields=title,description,category,submited,lastUpdated,profilePicture/' + this.bubbleId;
		}
	});

	var BubblePost = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/posts/' + this.id;
		}
	});

	var BubbleUser = Backbone.Model.extend({
		url: function(){
			console.log("Bubble User: ", this);
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
			this.count = response.count;
			_.each(response.posts, function(item){
				listObjects.push(item);
			});
			return listObjects;
		}
	});

	var BubbleEvent = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/bubbles/' + this.id + 'events';
		}
	});

	var BubbleDiscussion = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/posts/' + this.id + 'discussions';
		}
	});

	var BubbleFile = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/posts/' + this.id + 'files';
		}
	});

	var BubbleEvents = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: BubbleEvent,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/events?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/events?fields=name/limit=' + this.limit + '&page=' + this.page;
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

	var BubbleDiscussions = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: BubbleDiscussion,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/discussions?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/discussions?fields=name/limit=' + this.limit + '&page=' + this.page;
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

	var BubbleFiles = Backbone.Collection.extend({
		bubbleId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: BubbleFile,
		url: function(){
			//Explaination of next line: If this.fields.toString() throws a TypeError, use this.fields THEN if this.fields is undefined, use empty string.  Else use this.fields.toString()
			var fieldString = (this.fields && this.fields.toString()) || "";
			console.log("FIELDS: ", fieldString);
			if(fieldString.length > 0){
				//fieldString = fieldString.slice(0, fieldString.length-1);
				return '/2013-09-11/bubbles/' + this.bubbleId + '/files?fields=' + fieldString + '/limit=' + this.limit + '&page=' + this.page;
			}
			else{
				return '/2013-09-11/bubbles/' + this.bubbleId + '/files?fields=name/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			this.count = response.count;
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
					console.log('Post: ', serverModel);
					console.log('Servermodel userId: ', serverModel.userId);
					var newUser = new BubbleUser({id: serverModel.userId});
					console.log('Getting user');
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
			this.count = response.count;
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
			this.count = response.count;
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
			this.count = response.count;
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
			this.count = response.count;
			_.each(response.invitees, function(item){
				listObjects.push(item);
			});
			return listObjects;
		}
	});

	var MyBubbles = function(properties){
		var that = this;
		this.bubbleId = properties.bubbleId;
		//properties.callback();
		
		//this.bubblePosts = new BubblePosts();
		//this.bubbleDiscussions = new BubbleDiscussions();
		//this.bubbleFiles = new BubbleFiles();
		//this.bubbleMembers = new BubbleMembers();

		//this.bubbleUsers.watch(this.bubblePosts);
		//this.bubbleUsers.watch(this.bubbleDiscussions);
		//this.bubbleUsers.watch(this.bubbleFiles);

		// this.bubblePosts.bubbleId = properties.bubbleId;
		// this.bubblePosts.limit = properties.limit;
		// this.bubblePosts.fields = properties.fields;
		// this.bubblePosts.fetch();

		//this.bubbleMembers.bubbleId = properties.bubbleId;
		//this.bubbleMembers.fetch();

		this.bubbleUsers = new BubbleUsers();

		this.bubbleInfo = new BubbleInfo();
		this.bubbleInfo.on('change', properties.callback);
		this.bubbleInfo.bubbleId = properties.bubbleId;
		this.bubbleInfo.fetch({'success': properties.callback});

		var Events = function() {
			this.bubbleEvents = new BubbleEvents();
			that.bubbleUsers.watch(this.bubbleEvents);
			this.bubbleEvents.bubbleId = that.bubbleId;
			this.bubbleEvents.limit = properties.events.limit;
			this.bubbleEvents.fields = properties.events.fields;
			this.bubbleEvents.fetch({'success': properties.callback});

			var scope = this.bubbleEvents;
			this.fetchPage = new fetchPageHelper(scope);
			this.fetchNextPage = new fetchNextPageHelper(scope);
			this.fetchPrevPage = new fetchPrevPageHelper(scope);
			this.getCurrentPage = new getCurrentPageHelper(scope);
			this.getNumPages = new getNumPagesHelper(scope);
			this.setFields = new setFieldsHelper(scope);
			this.setLimit = new setLimitHelper(scope);
			this.getJSON = new getJSONHelper(scope);

			//return this.bubbleEvents.toJSON();
		};

		var Discussions = function() {
			this.bubbleDiscussions = new BubbleDiscussions();
			that.bubbleUsers.watch(this.bubbleDiscussions);
			this.bubbleDiscussions.bubbleId = that.bubbleId;
			this.bubbleDiscussions.limit = properties.discussions.limit;
			this.bubbleDiscussions.fields = properties.discussions.fields;
			this.bubbleDiscussions.fetch({'success': properties.callback});

			var scope = this.bubbleDiscussions;
			this.fetchPage = new fetchPageHelper(scope);
			this.fetchNextPage = new fetchNextPageHelper(scope);
			this.fetchPrevPage = new fetchPrevPageHelper(scope);
			this.getCurrentPage = new getCurrentPageHelper(scope);
			this.getNumPages = new getNumPagesHelper(scope);
			this.setFields = new setFieldsHelper(scope);
			this.setLimit = new setLimitHelper(scope);
			this.getJSON = new getJSONHelper(scope);

			//return this.bubbleDiscussions.toJSON();
		};

		var Files = function() {
			this.bubbleFiles = new BubbleFiles();
			that.bubbleUsers.watch(this.bubbleFiles);
			this.bubbleFiles.bubbleId = that.bubbleId;
			this.bubbleFiles.limit = properties.files.limit;
			this.bubbleFiles.fields = properties.files.fields;
			this.bubbleFiles.fetch({'success': properties.callback});

			var scope = this.bubbleFiles;
			this.fetchPage = new fetchPageHelper(scope);
			this.fetchNextPage = new fetchNextPageHelper(scope);
			this.fetchPrevPage = new fetchPrevPageHelper(scope);
			this.getCurrentPage = new getCurrentPageHelper(scope);
			this.getNumPages = new getNumPagesHelper(scope);
			this.setFields = new setFieldsHelper(scope);
			this.setLimit = new setLimitHelper(scope);
			this.getJSON = new getJSONHelper(scope);

			//return this.bubbleFiles.toJSON();
		};

		var Members = function() {
			var that = this;

			this.bubbleMembers = new BubbleMembers();
			this.bubbleMembers.bubbleId = properties.bubbleId;
			this.bubbleMembers.limit = properties.members.limit;
			this.bubbleMembers.fields = properties.members.fields;
			this.bubbleMembers.fetch({'success': properties.callback});

			this.fetchPage = new fetchPageHelper(this.bubbleMembers);
			this.fetchNextPage = new fetchNextPageHelper(this.bubbleMembers);
			this.fetchPrevPage = new fetchPrevPageHelper(this.bubbleMembers);
			this.getCurrentPage = new getCurrentPageHelper(this.bubbleMembers);
			this.getNumPages = new getNumPagesHelper(this.bubbleMembers);
			this.setFields = new setFieldsHelper(this.bubbleMembers);
			this.setLimit = new setLimitHelper(this.bubbleMembers);
			this.getJSON = new getJSONHelper(this.bubbleMembers);
		};

		var Admins = function() {
			var that = this;

			this.bubbleAdmins = new BubbleAdmins();
			this.bubbleAdmins.bubbleId = properties.bubbleId;
			this.bubbleAdmins.limit = properties.admins.limit;
			this.bubbleAdmins.fields = properties.admins.fields;
			this.bubbleAdmins.fetch({'success': properties.callback});

			this.fetchPage = new fetchPageHelper(this.bubbleAdmins);
			this.fetchNextPage = new fetchNextPageHelper(this.bubbleAdmins);
			this.fetchPrevPage = new fetchPrevPageHelper(this.bubbleAdmins);
			this.getCurrentPage = new getCurrentPageHelper(this.bubbleAdmins);
			this.getNumPages = new getNumPagesHelper(this.bubbleAdmins);
			this.setFields = new setFieldsHelper(this.bubbleAdmins);
			this.setLimit = new setLimitHelper(this.bubbleAdmins);
			this.getJSON = new getJSONHelper(this.bubbleAdmins);
		};

		var Applicants = function() {
			var that = this;

			this.bubbleApplicants = new BubbleApplicants();
			this.bubbleApplicants.bubbleId = properties.bubbleId;
			this.bubbleApplicants.limit = properties.applicants.limit;
			this.bubbleApplicants.fields = properties.applicants.fields;
			this.bubbleApplicants.fetch({'success': properties.callback});

			this.fetchPage = new fetchPageHelper(this.bubbleApplicants);
			this.fetchNextPage = new fetchNextPageHelper(this.bubbleApplicants);
			this.fetchPrevPage = new fetchPrevPageHelper(this.bubbleApplicants);
			this.getCurrentPage = new getCurrentPageHelper(this.bubbleApplicants);
			this.getNumPages = new getNumPagesHelper(this.bubbleApplicants);
			this.setFields = new setFieldsHelper(this.bubbleApplicants);
			this.setLimit = new setLimitHelper(this.bubbleApplicants);
			this.getJSON = new getJSONHelper(this.bubbleApplicants);
		};

		var Invitees = function() {
			var that = this;
			
			this.bubbleInvitees = new BubbleInvitees();
			this.bubbleInvitees.bubbleId = properties.bubbleId;
			this.bubbleInvitees.limit = properties.invitees.limit;
			this.bubbleInvitees.fields = properties.invitees.fields;
			this.bubbleInvitees.fetch({'success': properties.callback});

			this.fetchPage = new fetchPageHelper(this.bubbleInvitees);
			this.fetchNextPage = new fetchNextPageHelper(this.bubbleInvitees);
			this.fetchPrevPage = new fetchPrevPageHelper(this.bubbleInvitees);
			this.getCurrentPage = new getCurrentPageHelper(this.bubbleInvitees);
			this.getNumPages = new getNumPagesHelper(this.bubbleInvitees);
			this.setFields = new setFieldsHelper(this.bubbleInvitees);
			this.setLimit = new setLimitHelper(this.bubbleInvitees);
			this.getJSON = new getJSONHelper(this.bubbleInvitees);
		};




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

		this.Members = new Members();
		this.Admins = new Admins();
		this.Invitees = new Invitees();
		this.Applicants = new Applicants();
		//this.Events = new Events({limit: properties.limit, fields: properties.fields});
		//this.Discussions = new Discussions({limit: properties.limit, fields: properties.fields});
		//this.Files = new Files({limit: properties.limit, fields: properties.fields});
		this.Events = new Events();
		this.Discussions = new Discussions();
		this.Files = new Files();
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

	var testHelper = function(scope) {return function(){console.log("test", scope.toJSON())}};

	var fetchPageHelper = function(scope) {
		return function(page, callback){
			if(page == undefined) {page = scope.page};
			if(page >= scope.pages) {page = scope.pages-1};
			if(page < 0) {page = 0};
			scope.page = page;
			scope.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(page);
						}
					}
				});
			return page;
		};
	};

	var fetchNextPageHelper = function(scope) {
		return function(callback){
			if(scope.page < scope.pages-1){
				scope.page = that.bubbleEvents.page + 1;
				scope.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(scope.page);
						}
					}
				});
			}
		};
	};

	var fetchPrevPageHelper = function(scope) {
		return function(callback){
			if(scope.page > 0){
				scope.page = scope.page - 1;
				scope.fetch({
					success: function() {
						if(callback && (typeof callback === "function"))
						{
							callback(scope.page);
						}
					}
				});
			}
		};
	};

	var getCurrentPageHelper = function(scope) {
		return function(){
			return scope.page;
		};
	};

	var getNumPagesHelper = function(scope) {
		return function(){
			return scope.pages;
		};
	};

	var setFieldsHelper = function(scope) {
		return function(fieldString){
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
			scope.fields = fields;
			return fields;
		};
	};

	var setLimitHelper = function(scope) {
		return function(limit){
			scope.limit = limit;
			return limit;
		};
	};

	var getJSONHelper = function(scope) {
		return function(){
			return scope.toJSON();
		};
	};

}());