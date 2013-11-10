// TODO: Use require.js instead of global namespace
(function(){
  var BubblePost = BubbleRest.Model.extend({
    url: function(){
      // TODO: Use bubble-related post URL
      return '/api/v1_0/posts/' + this.id;
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

  var BubblePosts = makeRelatedCollection(BubblePost, 'posts');
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
      } else {
        callback(collection.page);
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
      } else {
        callback(collection.page);
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

    getJSON: function() {
      return this.collection.toJSON();
    }
  });

  // Bubbles API
  var MyBubbles = function(properties) {
    var that = this;
    this.bubbleId = properties.bubbleId;

    // Loading status
    var loading = 0;
    var initialized = false;

    function maybeComplete() {
      console.log('MAYBE!', loading);

      loading -= 1;

      if (initialized && !loading && properties.callback)
        properties.callback(that.bubbleJson);
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
      }
    });

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

    if (properties.admin && properties.admins.load)
      fetchRelated(this.Admins);

    // Applications
    var bubbleApplicants = new BubbleApplicants();
    bubbleApplicants.bubbleId = that.bubbleId;

    if (properties.applicants) {
      bubbleApplicants.limit = properties.applicants.limit;
      bubbleApplicants.fields = properties.applicants.fields;
    }

    this.Applicants = new PagedData(bubbleApplicants);

    if (properties.applicants && properties.applicants.load)
      fetchRelated(this.applicants);

    // Invitees
    var bubbleInvitees = new BubbleInvitees();
    bubbleInvitees.bubbleId = that.bubbleId;

    if (properties.invitees) {
      bubbleInvitees.limit = properties.invitees.limit;
      bubbleInvitees.fields = properties.invitees.fields;
    }

    this.Invitees = new PagedData(bubbleInvitees);

    if (properties.invitees && properties.invitees.load)
      fetchRelated(this.Invitees);

    initialized = true;

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
