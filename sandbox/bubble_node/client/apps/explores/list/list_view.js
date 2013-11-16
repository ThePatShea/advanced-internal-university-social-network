App.module('ExploresApp.List', function(List, App, Backbone, Marionette, $, _){

  List.Layout = Marionette.Layout.extend({
    template: 'explores/list/templates/list_layout',
    regions: {
      subpanelRegion: '#menu-region',
      showRegion: '#show-region'
    }
  });

  List.Explore = Marionette.ItemView.extend({
    template: 'explores/list/templates/explore',
    tagName: 'li',
    ui: {
      a: "a"
    },
    triggers: {
      'click': 'explore:clicked'
    },
    modelEvents: {
      "change:chosen" : "changeChosen"
    },
    changeChosen: function(model, value, options){
      this.ui.a.toggleClass("tab-active", value)
    }

  });

  List.Explores = Marionette.CompositeView.extend({
    template: 'explores/list/templates/explores',
    itemView: List.Explore,
    itemViewContainer: 'ul'
  });

});
