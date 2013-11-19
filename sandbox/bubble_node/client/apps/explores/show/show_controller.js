App.module('ExploresApp.Show', function(Show, App, Backbone, Marionette, $, _){

  Show.Controller = App.Controllers.Base.extend({
    initialize: function(options){
      var explore = App.request("explore:entity", options.id)
      this.layout = new Show.Layout({model: explore});
      this.show(this.layout);
    }
  });

});
