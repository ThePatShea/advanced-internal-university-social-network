App.module('ExploresApp.List', function(List, App, Backbone, Marionette, $, _){
  //ExploreApp list view code goes here
  List.Layout = Marionette.Layout.extend({
    template: 'explores/list/templates/list_layout',
    regions: {
      subpanelRegion: '#subpanel',
      showRegion: '#show_region'
    }
  });

  List.Explore = Marionette.ItemView.extend({
    template: 'explores/show/templates/explore',
    tagName: 'li',
    triggers: {
      'click': 'explore:clicked'
    }
  });

  List.Explores = Marionette.CompositeView.extend({
    template: 'explores/list/templates/explores',
    itemView: List.Explore,
    itemViewContainer: 'ul'
  });
});