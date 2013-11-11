App.module("SettingsApp.List", function(List, App, Backbone, Marionette, $, _) {

  List.Settings = Marionette.ItemView.extend({
    template: 'settings/list/templates/settings'
  });

});
