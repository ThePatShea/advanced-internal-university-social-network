App.module("BubblesApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Controller = App.Controllers.Base.extend({
    initialize: function(options) {
      var bubbles = App.request('bubble:entities');
      this.layout = this.getLayoutView();

      // this.listenTo(bubbles, "collection:change:one", function(bubble){
      App.execute("show:bubble", bubbles[0], this.layout.showBubbleRegion)
      // }),

      this.listenTo(this.layout, "show", function(){
        this.bubblesRegion(bubbles);
      })

      this.show(this.layout);
    },
    bubblesRegion: function(bubbles) {
      var bubblesView = this.getBubblesView(bubbles);
      this.show(bubblesView, { region: this.layout.subpanelRegion })
    },
    getBubblesView: function(bubbles) {
      return new List.Bubbles({collection: bubbles});
    },
    getLayoutView: function() {
      return new List.Layout();
    }
  })

});
