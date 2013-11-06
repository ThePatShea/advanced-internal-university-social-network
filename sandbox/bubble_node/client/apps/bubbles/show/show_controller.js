App.module("BubblesApp.Show", function(Show, App, Backbone, Marionette, $, _) {

  Show.Controller = App.Controllers.Base.extend({
    initialize: function(options) {
      options = options || {};

      bubbleView = this.getBubbleView(options.bubble);
      this.show(bubbleView);
    },

    getBubbleView: function(bubble) {
      return new Show.Bubble({ model: bubble });
    }
  });

});
