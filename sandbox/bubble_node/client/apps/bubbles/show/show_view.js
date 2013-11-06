App.module("BubblesApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  Show.Bubble = Marionette.ItemView.extend({
    template: 'bubbles/show/templates/show'
  });

});
