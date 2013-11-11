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
    model: SidebarExplore,
    url: function() {
      return '/api/v1_0/explores/?fields=' + exploreFields;
    },
    parse: function(response) {
      return BubbleModels.parsePagedData(this, response, 'explores');
    }
  });

  var SidebarBubbles = BubbleRest.Collection.extend({
    model: SidebarBubble,
    url: function() {
      // TODO: Create new REST endpoint
      return '/2013-09-11/userBubbles/' + Meteor.userId() + '?fields=' + bubbleFields;
    },
    //parse: function(response) {
    //  return BubbleModels.parsePagedData(this, response, 'bubbles');
    //}
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
  };

  var api = {
    Sidebar: Sidebar
  };

  window.SidebarData = api;
}());
