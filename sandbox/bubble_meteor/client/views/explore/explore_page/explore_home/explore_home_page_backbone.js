Template.explorePageBackbone.created = function(){
	ExplorePost = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/post/' + this.id;
		}
	});

	ExploreBubble = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/bubbles/' + this.id;
		}
	});

	ExploreUser = Backbone.Model.extend({
		url: function(){
			return '/2013-09-11/users/' + this.id;
		}
	});


	ExplorePosts = Backbone.Collection.extend({
		exploreId : 'none',
		limit: 10,
		page: 0,
		fields: [],
		model: ExplorePost,
		url: function(){
			var fieldString = '';
			_.each(this.fields, function(field){
				fieldString = fieldString + field + ',';
			});
			if(fieldString.length > 0){
				fieldString = fieldString.slice(0, fieldString.length-1);
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


	ExploreUsers = Backbone.Collection.extend({
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


	ExploreBubbles = Backbone.Collection.extend({
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

	ExploreSection = function(properties){
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

}



Template.explorePageBackbone.rendered = function(){
	//var currentExploreId = window.location.pathname.split("/")[2];
	currentExploreId = 'pxmgzT74iwBbadvyp';
	es = new ExploreSection({
		exploreId: currentExploreId,
		limit: 10,
		fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted']
	});
}