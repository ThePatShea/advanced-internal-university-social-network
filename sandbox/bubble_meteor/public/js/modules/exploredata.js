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
	};

	var ExplorePostPage = function(exploreId, postId, callback) {
		var that = this;

		this.exploreInfo = new ExploreInfo();
		this.exploreInfo.id = exploreId;

		this.explorePost = new ExplorePost();
		this.explorePost.id = postId;

		this.explorebubble = null;

		this.exploreInfo.fetch({
			success: function() {
				that.explorePost.fetch({
					success: function(post) {
						if (post.postAsType === 'bubble') {
							that.exploreBubble = new BubbleModels.Bubble({id: post.postAsId});
							that.exploreBubble.fetch({
								success: function() {
									if (callback)
										callback(post);
								}
							});
						} else {
							callback(post);
						}
					}
				});
			}
		});

		this.getExplore = function() {
			return this.exploreInfo && this.exploreInfo.toJSON();
		};

		this.getPost = function() {
			return this.explorePost && this.explorePost.toJSON();
		};

		this.getBubble = function() {
			return this.exploreBubble && this.exploreBubble.toJSON();
		};

		this.toggleGoing = function(userId) {
			var attendees = this.explorePost.get('attendees');

			if (attendees.indexOf(userId) === -1) {
				attendees.push(userId);
			} else {
				attendees = _.without(attendees, userId);
			}
			this.explorePost.set('attendees', attendees);
		};
	};

	var api = {};
	api.ExplorePostPage = ExplorePostPage;
	api.ExploreSection = ExploreSection;
	api.Dashboard = Dashboard;

	window.ExploreData = api;
}());
