App.module("DashboardApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Dashboard = Marionette.ItemView.extend({
    template: 'dashboard/list/templates/dashboard'
  });

});
