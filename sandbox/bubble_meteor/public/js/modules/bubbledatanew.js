// TODO: Use require.js instead of global namespace
(function(){
  var BubblePost = Backbone.Model.extend({
    url: function(){
      // TODO: Use bubble-related post URL
      return '/api/v1_0/posts/' + this.id;
    }
  });

  var BubbleInfo = Backbone.Model.extend({
    url: function(){
      console.log('/2013-09-11/bubbles/' + this.bubbleId)
      return '/2013-09-11/bubbles?fields=title,description,category,submited,lastUpdated,profilePicture,bubbleType,users/' + this.bubbleId;
    }
  });

  var UserRelatedModel = BubbleRest.Collection.extend({
    excludeFields: ['user'],
    // Pre-fetch related models
    fetchRelated: function(model, callback) {
      if (model.userId) {
        var user = BubbleModels.User({id: model.get('postAsId')});
        user.fetch({
          success: function(related) {
            model.set('user', related);
            callback(model);
          },
          error: function() {
            callback(model);
          }
        });
      }
    }
  });

  var BubbleEvent = UserRelatedModel.extend({
    url: function(){
      return '/2013-09-11/bubbles/' + this.id + 'events';
    }
  });

  var BubbleDiscussion = UserRelatedModel.extend({
    url: function(){
      return '/2013-09-11/posts/' + this.id + 'discussions';
    }
  });

  var BubbleFile = UserRelatedModel.extend({
    url: function(){
      return '/2013-09-11/posts/' + this.id + 'files';
    }
  });

  function makeRelatedCollection(model, name) {
    return BubbleRest.Collection.extend({
      bubbleId : 'none',
      limit: 10,
      page: 0,
      fields: [],
      model: model,
      url: function() {
        var fieldString = (this.fields && this.fields.toString()) || '';

        if (fieldString.length === 0)
          fieldString = 'name';

        return '/api/v1_0/bubbles/' + this.bubbleId + '/' + name + '?limit=' + this.limit + '&page=' + this.page + '&fields=' + fieldString;
      },
      parse: function(response) {
        return BubbleModels.parsePagedData(this, response);
      }
    });
  }

  var BubblePosts = makeRelatedCollection(BubblePost, 'posts');
  var BubbleEvents = makeRelatedCollection(BubbleEvent, 'events');
  var BubbleDiscussions = makeRelatedCollection(BubbleDiscussion, 'discussions');
  var BubbleFiles = makeRelatedCollection(BubbleFile, 'files');

  // Paged data helpers
  function PagedData(collection) {
    this.collection = collection;
  }

  _.extend(PagedData.prototype, {
    fetchPage: function(page, callback) {
      if (!page)
        page = this.collection.page;

      if (page >= this.collection.pages)
        page = this.collection.pages - 1;

      if (page < 0)
        page = 0;

      this.collection.page = page;

      this.collection.fetch({
        success: function() {
          if (callback)
            callback(page);
        }
      });
    },

    fetchNextPage: function(callback) {
      var collection = this.collection;

      if (collection.page < collection.pages - 1) {
        collection.page = collection.page + 1;
        collection.fetch({
          success: function() {
            if (callback)
              callback(collection.page);
          }
        });
      }
    },

    fetchPrevPage: function(callback) {
      var collection = this.collection;

      if (collection.page > 0) {
        collection.page = collection.page - 1;

        collection.fetch({
          success: function() {
            if (callback)
              callback(collection.page);
          }
        });
      }
    },

    getCurrentPage: function() {
      return this.collection.page;
    },

    getNumPages: function() {
      return this.collection.pages;
    },

    setLimitHelper: function(limit) {
      this.collection.limit = limit;
    },

    getJSON: function() {
      return this.collection.toJSON();
    }
  });

  // Bubbles API
  var MyBubbles = function(properties) {
    var that = this;
    this.bubbleId = properties.bubbleId;

    // Fetch bubble info
    this.bubbleInfo = new BubbleInfo();
    this.bubbleInfo.on('change', properties.callback);
    this.bubbleInfo.bubbleId = properties.bubbleId;
    this.bubbleInfo.fetch({
      success: function(model) {
        this.bubbleJson = model.toJSON();

        if (properties.callback)
          properties.callback(model);
      }
    });

    // Events helper
    var bubbleEvents = new BubbleEvents();
    bubbleEvents.bubbleId = this.bubbleId;
    bubbleEvents.limit = properties.events.limit;
    bubbleEvents.fields = properties.events.fields;
    this.Events = new PagedData(bubbleEvents);

    this.Events.toggleGoing = function(postId,userId,callback) {
      //var test = function(){bubbleDep.changed();}
      tmp = this.bubbleEvents.get(postId);
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
      //tmp.trigger("change");
      //bubbleDep.changed();
      /*if(typeof callback === "function")
        callback();*/
    };

    // Discussions
    var bubbleDiscussions = new BubbleDiscussions();
    bubbleDiscussions.bubbleId = that.bubbleId;
    bubbleDiscussions.limit = properties.discussions.limit;
    bubbleDiscussions.fields = properties.discussions.fields;

    this.Discussions = new PagedData(bubbleDiscussions);

    // Files
    var bubbleFiles = new BubbleFiles();
    bubbleFiles.bubbleId = that.bubbleId;
    bubbleFiles.limit = properties.discussions.limit;
    bubbleFiles.fields = properties.discussions.fields;

    this.Files = new PagedData(bubbleFiles);

    // API
    this.isAdmin = function(id) {
      var users = this.bubbleJson.users.admins;
      return users.admins.indexOf(id) !== -1;
    };

    this.isMember = function(id) {
      var users = this.bubbleJson.users.members;
      return users.admins.indexOf(id) !== -1;
    };

    this.isApplicant = function(id) {
      var users = this.bubbleJson.users.applicants;
      return users.admins.indexOf(id) !== -1;
    };

    this.isInvitee = function(id) {
      var users = this.bubbleJson.users.invitees;
      return users.admins.indexOf(id) !== -1;
    };
  };

  var api = {
    MyBubbles: MyBubbles
  };
  window.BubbleDataNew = api;
})();