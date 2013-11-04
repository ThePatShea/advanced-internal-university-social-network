App.module("HeaderApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Controller = App.Controllers.Base.extend({
    initialize: function(options) {
      listView = this.getListView();
      options.region.show(listView);
    },

    getListView: function() {
      return new List.Header();
    }
  });
});
