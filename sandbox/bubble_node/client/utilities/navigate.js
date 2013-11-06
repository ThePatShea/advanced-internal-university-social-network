App.navigate = function(route, options){
  var options = options || {};
  Backbone.history.navigate(route, options);
}

App.startHistory = function(){
  Backbone.history.start()
}
