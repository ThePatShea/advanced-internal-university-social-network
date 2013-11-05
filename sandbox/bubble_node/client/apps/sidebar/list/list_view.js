App.module("SidebarApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.View = Marionette.ItemView.extend({
    template: Templates['./client/apps/sidebar/templates/sidebar.html.handlebars']
  });

});
