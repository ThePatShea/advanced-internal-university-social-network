App.module('SidebarApp.List', function(List, App, Backbone, Marionette, $, _) {
  List.Controller = App.Controllers.Base.extend({
    initialize: function() {
      SidebarApp.sidebars = sidebars = App.request("sidebar:entities");
      // SidebarApp.sidebars = sidebars

      view = new List.View({collection: sidebars});
      this.show(view);
    },

    onClose: function() {
      delete SidebarApp.sidebars
    }
  });
});
