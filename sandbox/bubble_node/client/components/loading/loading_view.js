App.module("Components.Loading", function(Loading, App, Backbone, Marionette, $, _) {

  Loading.View = Marionette.ItemView.extend({
    template: "loading/templates/loading"
  })

})