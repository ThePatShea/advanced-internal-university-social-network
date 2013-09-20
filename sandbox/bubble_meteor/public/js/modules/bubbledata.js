(function(){
	BubbleData = {};
	
	var ExplorePost = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/post/' + this.id;
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
	})


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
				return '/2013-09-11/explores/' + this.exploreId + '/posts/limit=' + this.limit + '&page=' + this.page;
			}
		},
		parse: function(response){
			var listObjects = [];
			this.pages = response.pages;
			_.each(response.posts, function(item){listObjects.push(item);});
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
						newUser.fetch();
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
						newBubble.fetch();
						that.add(newBubble);
					}
				});
			}
		}
	});

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

		this.getPage = function(page){
			that.explorePosts.page = page;
			that.explorePosts.fetch();
		}

		this.nextPage = function(){
			if(that.explorePosts.page < that.explorePosts.pages){
				that.explorePosts.page = that.explorePosts.page + 1;
				that.explorePosts.fetch();
			}
		}

		this.prevPage = function(){
			if(that.explorePosts.page > 0){
				that.explorePosts.page = that.explorePosts.page - 1;
				that.explorePosts.fetch();
			}
		}
	}

	BubbleData.ExploreSection = ExploreSection;
	BubbleData.ExploreUsers = ExploreUsers;
	BubbleData.ExploreBubbles = ExploreBubbles;

}());