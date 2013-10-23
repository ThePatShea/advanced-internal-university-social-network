(function(){
	ExploreData = {};

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
								if(typeof exploreDep !== "undefined")
									exploreDep.changed();
								if(typeof explorePageDep !== "undefined")
									explorePageDep.changed();
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
								if(typeof exploreDep !== "undefined")
									exploreDep.changed();
								if(typeof explorePageDep !== "undefined")
									explorePageDep.changed();
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
		that = this;
		this.dashboardUsers = new DashboardUsers();
		this.dashboardBubbles = new DashboardBubbles();
		this.dashboardPosts = new DashboardPosts();

		this.dashboardUsers.watch(this.dashboardPosts);
		this.dashboardBubbles.watch(this.dashboardPosts);

		this.dashboardPosts.fetch({async: false});

		var posts = this.dashboardPosts.toJSON();
		_.each(posts, function(post){
			if(post.postAsType === "bubble")
			{
				post.bubble = that.dashboardBubbles.get(post.postAsId).toJSON();
			}
			if(post.postAsType === "user")
			{
				post.user = that.dashboardUsers.get(post.postAsId).toJSON();
			}
		});
		posts = _.reject(posts, function(post){
			return post.postType === "file";
		});

		this.getBubbles = new getJSONHelper(this.dashboardBubbles);
		this.getUsers = new getJSONHelper(this.dashboardUsers);
		this.getPosts = new getJSONHelper(this.dashboardPosts);
		this.getData = function() {return posts};

		//return this.dashboardPosts.toJSON();
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
		};

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
		};

		this.toggleGoing = function(postId,userId,callback){
			//var test = function(){bubbleDep.changed();}
			tmp = this.explorePosts.get(postId);
			tmp.on("change",callback);
			console.log("TMP: ", tmp);
			tmpData = tmp.get("attendees");
			if(tmpData.indexOf(userId) == -1)
			{
				var retVal = [];
				_.each(tmpData,function(data){
					retVal.push(_.clone(data));
				})
				retVal.push(userId);
			}
			else
			{
				//tmpData.splice(tmpData.indexOf(userId), 1);
				tmpData = tmpData.slice(tmpData.indexOf("GAd9sexEBsk58X4t6")+1, tmpData.length);
				var retVal = [];
				_.each(tmpData,function(data){
					retVal.push(_.clone(data));
				});
			}
			console.log("Setting this data: ", retVal);
			tmp.set("attendees",retVal);
		};
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

	ExploreData.ExplorePostPage = ExplorePostPage;
	ExploreData.ExploreSection = ExploreSection;
	ExploreData.ExploreUsers = ExploreUsers;
	ExploreData.ExploreBubbles = ExploreBubbles;
	ExploreData.Dashboard = Dashboard;

	var fetchNextPageHelper = function(scope) {
		return function(callback){
			if(scope.page < scope.pages-1){
				scope.page = scope.page + 1;
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