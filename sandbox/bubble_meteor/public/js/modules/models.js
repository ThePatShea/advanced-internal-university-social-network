// TODO: Use require.js instead of global namespace
(function() {
  // Common models
  var Bubble = BubbleRest.Model.extend({
    url: function(){
      return '/api/v1_0/bubbles/' + this.id;
    }
  });
  var User = BubbleRest.Model.extend({
    url: function(){
      return '/api/v1_0/users/' + this.id;
    }
  });

  // Helpers
  function parsePagedData(collection, response) {
    var listObjects = [];
    collection.pages = response.pages;
    collection.count = response.count;
    _.each(response.posts, function(item){
      listObjects.push(item);
    });
    return listObjects;
  }

  // Public API
  var api = {
    Bubble: Bubble,
    User: User,

    parsePagedData: parsePagedData
  };

  window.BubbleModels = api;
})();
