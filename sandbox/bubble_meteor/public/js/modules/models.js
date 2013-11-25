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
  var Post = BubbleRest.Model.extend({
    url: function(){
      return '/api/v1_0/posts/' + this.id;
    }
  });

  // Helpers
  function parsePagedData(collection, response, field) {
    var listObjects = [];
    collection.pages = response.pages;
    collection.count = response.count;
    _.each(response[field], function(item){
      listObjects.push(item);
    });
    return listObjects;
  }

  // Public API
  var api = {
    Bubble: Bubble,
    User: User,
    Post: Post,

    parsePagedData: parsePagedData
  };

  window.BubbleModels = api;
})();
