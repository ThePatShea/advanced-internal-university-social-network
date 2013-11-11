// TODO: Use require.js instead of global namespace
(function(){
  var exploreFields = 'title,description,sumitted,lastUpdated,exploreType,exploreIcon';
  var bubbleFields = 'title,description,category,submited,lastUpdated,profilePicture,bubbleType,users';

  var SidebarExplore = BubbleRest.Model.extend({
    url: function() {
      // TODO: Configurable fields?
      return '/api/v1_0/explores/' + this.id + '?fields=' + exploreFields;
    }
  });

  var SidebarBubble = BubbleRest.Model.extend({
    url: function(){
      return '/api/v1_0/bubbles/' + this.bubbleId + '?fields=' + bubbleFields;
    }
  });

  var SidebarExplores = BubbleRest.Collection.extend({
    limit: 0,
    model: SidebarExplore,
    url: function() {
      var url = '/api/v1_0/explores/?fields=' + exploreFields;

      if (this.limit)
        url += '&limit=' + this.limit;

      return url;
    },
    parse: function(response) {
      return BubbleModels.parsePagedData(this, response, 'explores');
    }
  });

  var SidebarBubbles = BubbleRest.Collection.extend({
    limit: 0,
    model: SidebarBubble,
    url: function() {
      var url = '/api/v1_0/users/' + Meteor.userId() + '/bubbles?fields=' + bubbleFields;

      if (this.limit)
        url += '&limit=' + this.limit;

      return url;
    },
    parse: function(response) {
      return BubbleModels.parsePagedData(this, response, 'bubbles');
    }
  });

  var Sidebar = function(name) {
    that = this;
    this.name = name;
    this.explores = new SidebarExplores();
    this.bubbles = new SidebarBubbles();

    this.getData = function(mode, callback) {
      function fetch(collection) {
        collection.fetch({
          success: function(collection) {
            callback(collection.toJSON());
          },
          error: function() {
            callback();
          }
        });
      }

      if (mode === 'explore') {
        fetch(this.explores);
      } else
      if (mode === 'mybubbles') {
        fetch(this.bubbles);
      } else {
        callback(null);
      }
    };

    function getFirstItemId(collection, callback) {
      collection.limit = 1;
      collection.fetch({
        success: function(collection) {
          if (collection.count > 0) {
            callback(collection.models[0].id);
          } else {
            callback(null);
          }
        },
        error: function() {
          callback(null);
        }
      });
    }

    this.getFirstBubbleId = function(callback) {
      getFirstItemId(this.bubbles, callback);
    };

    this.getFirstExploreId = function(callback) {
      getFirstItemId(this.explores, callback);
    };
  };

  var api = {
    Sidebar: Sidebar
  };

  window.SidebarData = api;
}());
