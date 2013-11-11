App.module("BubblesApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Controller = App.Controllers.Base.extend({
    initialize: function(options) {
      var bubbles = App.request('bubble:entities');
      var bubblesView = this.getBubblesView(bubbles);

      this.layout = this.getLayoutView();
      this.show(this.layout);
      this.show(bubblesView, { region: this.layout.subpanelRegion })

      this.setShownBubble(bubbles.at(0));
      this.listenTo(bubblesView, 'itemview:bubble:clicked', function(ive, clickedView) {
        this.setShownBubble(clickedView.model);
      });

    },

    getBubblesView: function(bubbles) {
      return new List.Bubbles({ collection: bubbles });
    },

    getLayoutView: function() {
      return new List.Layout();
    },

    setShownBubble: function(bubble) {
      App.execute("show:bubble", bubble, this.layout.showBubbleRegion);
    }
  })

});
