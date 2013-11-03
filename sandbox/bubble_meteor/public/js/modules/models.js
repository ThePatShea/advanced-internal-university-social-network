// TODO: Use require.js instead of global namespace
(function() {
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

  var api = {
    Bubble: Bubble,
    User: User,
  };

  window.BubbleModels = api;
})();
