App.module("BubblesApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Layout = Marionette.Layout.extend({
    template: 'bubbles/list/templates/list_layout',
    regions: {
      subpanelRegion: '#menu-region',
      showBubbleRegion: '#show-region'
    }
  });

  List.Bubble = Marionette.ItemView.extend({
    template: 'bubbles/list/templates/bubble',
    tagName: 'li',
    triggers: {
      'click': 'bubble:clicked'
    }
  });

  List.Bubbles = Marionette.CompositeView.extend({
    template: 'bubbles/list/templates/bubbles',
    itemView: List.Bubble,
    itemViewContainer: 'ul'
  });
});
