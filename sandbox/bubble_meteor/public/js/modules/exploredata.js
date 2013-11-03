// TODO: Use require.js instead of global namespace
(function(){
  var ExplorePost = BubbleRest.Model.extend({
		excludeFields: ['user', 'bubble'],
    url: function(){
			// TODO: Fix me. Should be linked to exploreId instead of reading from global posts collection.
      return '/api/v1_0/posts/' + this.id;
    },
    fetchRelated: function(model, callback) {
      function fetch(field, item) {
        item.fetch({
          success: function(related) {
            model.set(field, related);
            callback(model);
          },
          error: function() {
            callback(model);
          }
        });
      }

      if (model.get('postAsType') === 'user') {
        var user = new BubbleModels.User({id: model.get('postAsId')});
        fetch('user', user);
      } else
      if (model.get('postAsType') === 'bubble') {
        var bubble = new BubbleModels.Bubble({id: model.get('postAsId')});
        fetch('bubble', bubble);
      } else {
				callback(model);
      }
    }
  });

	var ExploreInfo = BubbleRest.Model.extend({
		url: function(){
			// TODO: Configurable fields?
			return '/api/v1_0/explores/' + this.id + '?fields=title,description,sumitted,lastUpdated,exploreType,exploreIcon';
		}
	});

	var ExplorePosts = BubbleRest.Collection.extend({
		exploreId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: ExplorePost,
		url: function() {
			var fieldString = (this.fields && this.fields.toString()) || '';

			if (fieldString.length === 0)
				fieldString = 'name';

			return '/api/v1_0/explores/' + this.exploreId + '/posts?limit=' + this.limit + '&page=' + this.page + '&fields=' + fieldString;
		},
    parse: function(response) {
      return _.filter(BubbleModels.parsePagedData(this, response), function(v) {
        return v.postType !== 'file';
      });
    }
	});

	var DashboardPosts = BubbleRest.Collection.extend({
		model: ExplorePost,
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
				// TODO: Fix me, hardcoded id?
				//tmpData.splice(tmpData.indexOf(userId), 1);
				tmpData = tmpData.slice(tmpData.indexOf("GAd9sexEBsk58X4t6")+1, tmpData.length);
				var retVal = [];
				_.each(tmpData,function(data){
					retVal.push(_.clone(data));
				});
			}
			console.log("Setting this data: ", retVal);
			tmp.set("attendees", retVal);
		};
	};

	var ExplorePostPage = function(id, callback) {
		this.explorePost = new ExplorePost();
		this.explorePost.id = id;
		this.explorePost.fetch({
			success: function() {
				if (callback)
					callback();
			}
		});

		this.getBubbleTitle = function(callback) {
			this.post = this.explorePost.toJSON();

			this.exploreBubble = new BubbleModels.Bubble();
			this.exploreBubble.id = this.post.postAsId;
			this.exploreBubble.fetch({
				success: function() {
					if (callback)
						callback();
				}
			});
		};
	};

	var api = {};
	api.ExplorePostPage = ExplorePostPage;
	api.ExploreSection = ExploreSection;
	api.Dashboard = Dashboard;

	window.ExploreData = api;
}());
