// TODO: Use require.js instead of global namespace
(function(){
  var BubblePost = BubbleRest.Model.extend({
    url: function(){
      // TODO: Use bubble-related post URL
      return '/api/v1_0/bubbles/' + this.bubbleId + '/posts/' + this.id;
    }
  });

  var BubbleInfo = BubbleRest.Model.extend({
    url: function(){
      return '/api/v1_0/bubbles/' + this.bubbleId + '?fields=title,description,category,submited,lastUpdated,profilePicture,bubbleType,users';
    }
  });

  var UserRelatedModel = BubbleRest.Model.extend({
    excludeFields: ['user'],
    // Pre-fetch related models
    fetchRelated: function(model, callback) {
      var userId = model.get('userId');

      if (userId) {
        var user = new BubbleModels.User({id: userId});
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
      return '/api/v1_0/bubbles/' + this.bubbleId + 'events';
    }
  });

  var BubbleDiscussion = UserRelatedModel.extend({
    url: function(){
      return '/api/v1_0/bubbles/' + this.bubbleId + 'discussions';
    }
  });

  var BubbleFile = UserRelatedModel.extend({
    url: function(){
      return '/api/v1_0/bubbles/' + this.bubbleId + 'files';
    }
  });

  function makeRelatedCollection(model, name, fields) {
    return BubbleRest.Collection.extend({
      bubbleId : 'none',
      limit: 10,
      page: 0,
      fields: fields,
      model: model,
      url: function() {
        var fieldString = (this.fields && this.fields.toString()) || '';

        if (fieldString.length === 0)
          fieldString = 'name';

        return '/api/v1_0/bubbles/' + this.bubbleId + '/' + name + '?limit=' + this.limit + '&page=' + this.page + '&fields=' + fieldString;
      },
      parse: function(response) {
        return BubbleModels.parsePagedData(this, response, name);
      }
    });
  }

  //var BubblePosts = makeRelatedCollection(BubblePost, 'posts');
  var BubbleEvents = makeRelatedCollection(BubbleEvent, 'events');
  var BubbleDiscussions = makeRelatedCollection(BubbleDiscussion, 'discussions');
  var BubbleFiles = makeRelatedCollection(BubbleFile, 'files');

  var userFields = ['username', 'name', 'profilePicture'];
  var BubbleMembers = makeRelatedCollection(BubbleModels.User, 'members', userFields);
  var BubbleAdmins = makeRelatedCollection(BubbleModels.User, 'admins', userFields);
  var BubbleApplicants = makeRelatedCollection(BubbleModels.User, 'applicants', userFields);
  var BubbleInvitees = makeRelatedCollection(BubbleModels.User, 'invitees', userFields);

  // Paged data helpers
  function PagedData(collection) {
    this.collection = collection;
  }

  _.extend(PagedData.prototype, {
    fetchPage: function(page, callback) {
      if (typeof page === 'undefined')
        page = this.collection.page;

      if (page >= this.collection.pages)
        page = this.collection.pages - 1;

      if (page < 0)
        page = 0;

      this.collection.page = page;

      this.collection.fetch({
        success: function() {
          if (callback)
            callback(null, page);
        },
        error: function(error) {
          if (callback)
            callback(error);
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
              callback(null, collection.page);
          },
          error: function(error) {
            if (callback)
              callback(error);
          }
        });
      } else {
        callback(null, collection.page);
      }
    },

    fetchPrevPage: function(callback) {
      var collection = this.collection;

      if (collection.page > 0) {
        collection.page = collection.page - 1;

        collection.fetch({
          success: function() {
            if (callback)
              callback(null, collection.page);
          },
          error: function(error) {
            if (callback)
              callback(error);
          }
        });
      } else {
        callback(null, collection.page);
      }
    },

    getCount: function() {
      return this.collection.count;
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

    refresh: function(callback) {
      this.fetchPage(this.collection.page, callback);
    },

    getJSON: function() {
      return this.collection.toJSON();
    }
  });

  // Bubbles API
  var MyBubbles = function(properties) {
    var that = this;
    this.bubbleId = properties.bubbleId;
    that.id = Math.random();

    // Loading status
    var loading = 0;
    var initialized = false;

    function maybeComplete(error) {
      loading -= 1;

      if (initialized && !loading && properties.callback) {
        Meteor.setTimeout(function() {
          if (error) {
            properties.callback(error);
          } else {
            properties.callback(null, that.bubbleJson);
          }
        });
      }
    }

    function fetchRelated(pagedData) {
      loading += 1;
      pagedData.fetchPage(0, maybeComplete);
    }

    // Fetch bubble info
    this.bubbleInfo = new BubbleInfo();
    this.bubbleInfo.bubbleId = properties.bubbleId;

    loading += 1;

    this.bubbleInfo.fetch({
      success: function(model) {
        that.bubbleJson = model.toJSON();
        maybeComplete();
      },
      error: function(error) {
        that.bubbleJson = null;
        maybeComplete(error);
      }
    });

    this.reloadBubble = function(callback) {
      this.bubbleInfo.fetch({
        success: function(model) {
          that.bubbleJson = model.toJSON();
          callback(null, that.bubbleJson);
        },
        error: function(error) {
          callback(error);
        }
      });
    };

    // Events helper
    var bubbleEvents = new BubbleEvents();
    bubbleEvents.bubbleId = this.bubbleId;
    if (properties.events) {
      bubbleEvents.limit = properties.events.limit;
      bubbleEvents.fields = properties.events.fields;
    }

    this.Events = new PagedData(bubbleEvents);

    if (properties.events && properties.events.load)
      fetchRelated(this.Events);

    // Discussions
    var bubbleDiscussions = new BubbleDiscussions();
    bubbleDiscussions.bubbleId = that.bubbleId;

    if (properties.discussions) {
      bubbleDiscussions.limit = properties.discussions.limit;
      bubbleDiscussions.fields = properties.discussions.fields;
    }

    this.Discussions = new PagedData(bubbleDiscussions);

    if (properties.discussions && properties.discussions.load)
      fetchRelated(this.Discussions);

    // Files
    var bubbleFiles = new BubbleFiles();
    bubbleFiles.bubbleId = that.bubbleId;

    if (properties.files) {
      bubbleFiles.limit = properties.files.limit;
      bubbleFiles.fields = properties.files.fields;
    }

    this.Files = new PagedData(bubbleFiles);

    if (properties.files && properties.files.load)
      fetchRelated(this.Files);

    // Members
    var bubbleMembers = new BubbleMembers();
    bubbleMembers.bubbleId = that.bubbleId;

    if (properties.members) {
      bubbleMembers.limit = properties.members.limit;
      bubbleMembers.fields = properties.members.fields;
    }

    this.Members = new PagedData(bubbleMembers);
    this.Members.name = 'members';

    if (properties.members && properties.members.load)
      fetchRelated(this.Members);

    // Admins
    var bubbleAdmins = new BubbleAdmins();
    bubbleAdmins.bubbleId = that.bubbleId;

    if (properties.admins) {
      bubbleAdmins.limit = properties.admins.limit;
      bubbleAdmins.fields = properties.admins.fields;
    }

    this.Admins = new PagedData(bubbleAdmins);
    this.Admins.name = 'admins';

    if (properties.admins && properties.admins.load)
      fetchRelated(this.Admins);

    // Applications
    var bubbleApplicants = new BubbleApplicants();
    bubbleApplicants.bubbleId = that.bubbleId;

    if (properties.applicants) {
      bubbleApplicants.limit = properties.applicants.limit;
      bubbleApplicants.fields = properties.applicants.fields;
    }

    this.Applicants = new PagedData(bubbleApplicants);
    this.Applicants.name = 'applicants';

    if (properties.applicants && properties.applicants.load)
      fetchRelated(this.Applicants);

    // Invitees
    var bubbleInvitees = new BubbleInvitees();
    bubbleInvitees.bubbleId = that.bubbleId;

    if (properties.invitees) {
      bubbleInvitees.limit = properties.invitees.limit;
      bubbleInvitees.fields = properties.invitees.fields;
    }

    this.Invitees = new PagedData(bubbleInvitees);
    this.Invitees.name = 'invitees';

    if (properties.invitees && properties.invitees.load)
      fetchRelated(this.Invitees);

    initialized = true;
  };

  var BubblePostPage = function(bubbleId, postId, callback) {
    var that = this;

    this.bubbleId = bubbleId;

    this.bubbleInfo = new BubbleInfo();
    this.bubbleInfo.bubbleId = bubbleId;

    this.post = new BubblePost();
    this.post.bubbleId = bubbleId;
    this.post.id = postId;

    this.user = new BubbleModels.User();

    var count = 0;

    function maybeComplete() {
      count -= 1;

      console.log('count', count);

      if (count <= 0 && callback) {
        Meteor.setTimeout(callback);
      }
    }

    count += 1;
    this.bubbleInfo.fetch({
      success: maybeComplete,
      error: maybeComplete
    });

    count += 1;
    this.post.fetch({
      success: function(post) {
        that.user.id = post.get('userId');

        that.user.fetch({
          success: maybeComplete,
          error: maybeComplete
        });
      },
      error: function() {
        console.log('Failed, recovered');
        maybeComplete();
      }
    });

    this.getBubble = function() {
      return this.bubbleInfo && this.bubbleInfo.toJSON();
    };

    this.getPost = function() {
      return this.post && this.post.toJSON();
    };

    this.getUser = function() {
      return this.user && this.user.toJSON();
    };

    this.toggleGoing = function(userId) {
      var attendees = this.post.get('attendees');

      if (attendees.indexOf(userId) === -1) {
        attendees.push(userId);
      } else {
        attendees = _.without(attendees, userId);
      }
      this.post.set('attendees', attendees);
    };
  };

  var Helpers = {
    isAdmin: function(bubble, id) {
      if (!bubble)
        return false;

      var users = bubble.users.admins;
      return users.indexOf(id) !== -1;
    },
    isMember: function(bubble, id) {
      if (!bubble)
        return false;

      var users = bubble.users.members;
      return users.indexOf(id) !== -1;
    },
    isApplicant: function(bubble, id) {
      if (!bubble)
        return false;

      var users = bubble.users.applicants;
      return users.indexOf(id) !== -1;
    },
    isInvitee: function(bubble, id) {
      if (!bubble)
        return false;

      var users = bubble.users.invitees;
      return users.indexOf(id) !== -1;
    }
  };

  var api = {
    MyBubbles: MyBubbles,
    BubblePostPage: BubblePostPage,
    Helpers: Helpers
  };

  window.BubbleDataNew = api;
})();
