App.module("SearchApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Search = Marionette.ItemView.extend({
    template: 'search/list/templates/search'
  });

});
