// TODO: Use require.js instead of global namespace
(function(){
  var BubblePost = Backbone.Model.extend({
    url: function(){
      // TODO: Use bubble-related post URL
      return '/api/v1_0/posts/' + this.id;
    }
  });

  var UserRelatedCollection = BubbleRest.Collection.extend({
    // Pre-fetch related models
    fetchRelated: function(coll, callback) {
      callback(coll);
    }
  });

  var api = {};
  window.BubbleDataNew = api;
})();