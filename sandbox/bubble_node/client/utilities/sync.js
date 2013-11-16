(function(Backbone){
  var _sync = Backbone.sync

  Backbone.sync = function(method, entity, options){
    var sync = _sync(method, entity, options)

    if(!entity._fetch && method === "read"){
      entity._fetch = sync
    }
  }
})(Backbone)
