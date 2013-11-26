(function(){
  var FoundBubble = BubbleRest.Model.extend({
    url: function() {
      return '/api/v1_0/' + this.bubbleId + '?fields=title,description,category,submitted,lastUpdated,bubbleType,users';
    }
  });

  var FoundUser = BubbleRest.Model.extend({
    url: function() {
      return '/api/v1_0/' + this.userId + '?fields=name,username,profilePicture'
    }
  });

  var FoundEvent = BubbleRest.Model.extend({
    url: function() {
      return '/api/v1_0/' + this.bubbleId + '/posts/' + this.id;
    }
  });

  var FoundDiscussion = BubbleRest.Model.extend({
    url: function() {
      return '/api/v1_0/' + this.bubbleId + '/posts/' + this.id;
    }
  });

  var FoundFile = BubbleRest.Model.extend({
    url: function() {
      return '/api/v1_0/' + this.bubbleId + '/posts/' + this.id;
    }
  });

  var FoundPost = BubbleRest.Model.extend({
    url: function() {
      return '/api/v1_0/' + this.bubbleId + '/posts/' + this.id;
    },
    fetchRelated: function(model, callback) {
      function fetch(field, item) {
        item.fetch({
          success: function(related) {
            model.set(field, related);
            callback(model);
          },
          error: function(error) {
            callback(model);
          }
        });
      }

      if (model.get('postAsType') === 'bubble') {
        var bubble = new FoundBubble({id: model.get('postAsId')});
        fetch('bubble', bubble);
      } else {
        callback(model);
      }
    }
  })

  var FoundBubbles = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundBubble,
    url: function() {
      return '/2013-09-11/bubbles/search?text=' + this.searchText;
    },
    parse: function(response) {
      return BubbleModels.parsePagedData(this, response, 'bubbles');
    }
  });

  var FoundUsers = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundUser,
    url: function() {
      return '/2013-09-11/users/search?text=' + this.searchText;
    },
    parse: function(response) {
      return BubbleModels.parsePagedData(this, response, 'users');
    }
  });

  var FoundEvents = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundEvent,
    url: function() {
      return '/2013-09-11/events/search?text=' + this.searchText;
    }
  });

  var FoundDiscussions = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundDiscussion,
    url: function() {
      return '/2013-09-11/discussions/search?text=' + this.searchText;
    }
  });

  var FoundFiles = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundFile,
    url: function() {
      return '/2013-09-11/files/search?text=' + this.searchText;
    }
  });

  var UserList = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundUser,
    url: function() {
      return '/2013-09-11/userList?idList=' + this.idList.toString() + '&limit=' + this.limit;
    }
  });

  var BubbleList = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundBubble,
    url: function() {
      return '/2013-09-11/bubbleList?idList=' + this.idList.toString() + '&limit=' + this.limit;
    }
  });

  //Does this need to be broken up per model?
  var PostList = BubbleRest.Collection.extend({
    limit: 10,
    model: FoundPost,
    url: function() {
      return '/2013-09-11/postList?idList=' + this.idList.toString() + '&limit=' + this.limit;
    }
  });

  var GetUserList = function() {
    var that = this;
    that.userList = new UserList();

    this.getUserList = function(idList, callback) {
      that.userList.idList = idList;
      that.userList.fetch({
        success: function(collection) {
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      })
    };
  };

  var GetBubbleList = function() {
    var that = this;
    that.bubbleList = new BubbleList();

    this.getBubbleList = function(idList, callback) {
      that.bubbleList.idList = idList;
      that.bubbleList.fetch({
        success: function(collection) {
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      })
    };
  };

  var GetPostList = function() {
    var that = this;
    that.postList = new PostList();

    this.getPostList = function(idList, callback) {
      that.postList.idList = idList;
      that.postList.fetch({
        success: function(collection) {
          /*_.each(collection.models, function(model){
            console.log("MODEL: ", model);
            model.fetchRelated(model);
          });*/
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      })
    };
  };

  var SearchBubbles = function() {
    var that = this;
    this.foundCollection = new FoundBubbles();

    this.search = function(searchText, callback) {
      that.foundCollection.searchText = searchText;
      that.foundCollection.fetch({
        success: function(collection) {
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      });
    }
  }

  var SearchUsers = function() {
    var that = this;
    this.foundCollection = new FoundUsers();

    this.search = function(searchText, callback) {
      that.foundCollection.searchText = searchText;
      that.foundCollection.fetch({
        success: function(collection) {
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      });
    }
  }

  var SearchEvents = function() {
    var that = this;
    this.foundCollection = new FoundEvents();

    this.search = function(searchText, callback) {
      that.foundCollection.searchText = searchText;
      that.foundCollection.fetch({
        success: function(collection) {
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      });
    }
  }

  var SearchDiscussions = function() {
    var that = this;
    this.foundCollection = new FoundDiscussions();

    this.search = function(searchText, callback) {
      that.foundCollection.searchText = searchText;
      that.foundCollection.fetch({
        success: function(collection) {
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      });
    }
  }

  var SearchFiles = function() {
    var that = this;
    this.foundCollection = new FoundFiles();

    this.search = function(searchText, callback) {
      that.foundCollection.searchText = searchText;
      that.foundCollection.fetch({
        success: function(collection) {
          callback(undefined, collection.toJSON());
        },
        error: function(error) {
          callback(error, undefined);
        }
      });
    }
  }

  var api = {
    SearchBubbles: SearchBubbles,
    SearchUsers: SearchUsers,
    SearchEvents: SearchEvents,
    SearchDiscussions: SearchDiscussions,
    SearchFiles: SearchFiles,
    GetUserList: GetUserList,
    GetBubbleList: GetBubbleList,
    GetPostList: GetPostList
  };

  window.SearchData = api;

}());