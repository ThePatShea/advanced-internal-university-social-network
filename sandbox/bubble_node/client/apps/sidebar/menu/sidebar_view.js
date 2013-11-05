App.module("SidebarApp.Menu", function(Menu, App, Backbone, Marionette, $, _){
	Menu.View = Marionette.ItemView.extend({
		template: Templates['./client/apps/sidebar/templates/sidebar.html.handlebars']
	});
});