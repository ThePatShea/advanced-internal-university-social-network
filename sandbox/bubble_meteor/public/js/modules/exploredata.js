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

	var ExploreInfo = BubbleRest.Model.extend({
		url: function(){
			// TODO: Configurable fields?
			return '/api/v1_0/explores/' + this.id + '?fields=title,description,sumitted,lastUpdated,exploreType,exploreIcon';
		}
	});

	var PostsBase = BubbleRest.Collection.extend({
		// Pre-fetch related models
		fetchRelated: function(coll, callback) {
			var scope = {
				count: 0
			};

			function maybeContinue() {
				scope.count -= 1;

				if (scope.count <= 0)
					callback(coll);
			}

			function fetch(model, field, item) {
				scope.count += 1;

				item.fetch({
					success: function(related) {
						model[field] = related;

						maybeContinue();
					},
					error: function() {
						maybeContinue();
					}
				});
			}

			for (var m = 0; m < coll.models.length; ++m) {
				var model = coll.models[m];

				if (model.get('postAsType') === 'user') {
					var user = new ExploreUser({id: model.get('postAsId')});
					fetch(model, 'user', user);
				} else
				if (model.get('postAsType') === 'bubble') {
					var bubble = new ExploreBubble({id: model.get('postAsId')});
					fetch(model, 'bubble', bubble);
				}
			}

			if (!scope.count)
				callback(coll);
		},
		toJSON: function() {
			var result = [];

			for (var i = 0; i < this.models.length; ++i) {
				var model = this.models[i];
				var raw = model.toJSON();

				if (raw.postAsType === 'user') {
					raw.user = model.user;
				} else
				if (raw.postAsType === 'bubble') {
					raw.bubble = model.bubble;
				}

				result.push(raw);
			}

			return result;
		}
	});

	var ExplorePosts = PostsBase.extend({
		exploreId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: ExplorePost,
		url: function() {
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
				if (item.postType !== 'file') {
					listObjects.push(item);
				}
			});
			return listObjects;
		}
	});

	var DashboardPosts = PostsBase.extend({
		url: function() {
			return '/2013-09-11/dashboard';
		}
	});

	var Dashboard = function() {
		that = this;
		this.dashboardPosts = new DashboardPosts();

		this.getData = function(callback) {
			this.dashboardPosts.fetch({
				success: function(collection) {
					var posts = collection.toJSON();

					posts = _.reject(posts, function(post) {
						return post.postType === 'file';
					});

					callback(posts);
				},
				error: function() {
					// TODO: Logging
					callback();
				}
			});
		};
	};

	var ExploreSection = function(properties) {
		if (!properties)
			properties = {};

		var that = this;

		this.exploreInfo = new ExploreInfo({id: properties.exploreId});
		this.exploreInfo.fetch({
			success: function(model) {
				if (properties.onInfoLoaded)
					properties.onInfoLoaded(model.toJSON());
			}
		});

		this.explorePosts = new ExplorePosts();
		this.explorePosts.exploreId = properties.exploreId;
		this.explorePosts.limit = properties.limit;
		this.explorePosts.fields = properties.fields;

		this.fetchPage = function(page, callback) {
			if (page === undefined)
				page = that.explorePosts.page;

			if (page >= that.explorePosts.pages)
				page = that.explorePosts.pages - 1;

			if (page < 0)
				page = 0;

			that.explorePosts.page = page;
			that.explorePosts.fetch({
					success: function() {
						if (callback)
							callback(page);
					}
				});

			return page;
		};

		this.fetchNextPage = function(callback) {
			if (that.explorePosts.page < that.explorePosts.pages-1){
				that.explorePosts.page = that.explorePosts.page + 1;
				that.explorePosts.fetch({
					success: function() {
						if (callback)
							callback(that.explorePosts.page);
					}
				});
			}
		};

		this.fetchPrevPage = function(callback) {
			if (that.explorePosts.page > 0) {
				that.explorePosts.page = that.explorePosts.page - 1;
				that.explorePosts.fetch({
					success: function() {
						if (callback)
							callback(that.explorePosts.page);
					}
				});
			}
		};

		this.getCurrentPage = function() {
			return that.explorePosts.page;
		};

		this.getNumPages = function() {
			return that.explorePosts.pages;
		};

		this.setLimit = function(limit){
			that.explorePosts.limit = limit;
			return limit;
		};

		this.setExplore = function(id) {
			if (id !== undefined) {
				that.exploreId = id;
				return id;
			}
			else {
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
			if (tmpData.indexOf(userId) == -1) {
				var retVal = [];
				_.each(tmpData,function(data){
					retVal.push(_.clone(data));
				})
				retVal.push(userId);
			}
			else {
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
				if (callback)
					callback();
			}
		});

		this.getBubbleTitle = function(callback){
			this.exploreBubble = new ExploreBubble();
			this.post = this.explorePost.toJSON();
			this.exploreBubble.id = this.post.postAsId;
			this.exploreBubble.fetch({
				success: function() {
					if (callback)
						callback();
				}
			});
		};
	};

	ExploreData.ExplorePostPage = ExplorePostPage;
	ExploreData.ExploreSection = ExploreSection;
	ExploreData.Dashboard = Dashboard;
}());