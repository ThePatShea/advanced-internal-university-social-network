App.module("SearchApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Controller = App.Controllers.Base.extend({
    initialize: function() {
      this.show(this.getView());
    },

    getView: function() {
      return new List.Search();
    }
  });

});