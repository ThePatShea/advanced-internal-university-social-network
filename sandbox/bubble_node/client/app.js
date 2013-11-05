// Move into a dynamic js file with server-injected vars
$(function() {
	App.start() // pass vars in here
});

//Backbone-Marionette App goes here
window.App = (function(Backbone, Marionette, $, _){

	var App = new Backbone.Marionette.Application();

	App.addRegions({
		headerRegion: '#header_container',
		sidebarRegion: '#sidebar_container',
		subpanelRegion: '#subpanel_container',
		mainRegion: '#main_region'
	});

	App.reqres.setHandler('default:region', function() {
		App.mainRegion;
	});

	App.addInitializer(function() {
		App.module("HeaderApp").start()
		App.module("SidebarApp").start()
	});

	// SidebarView = Backbone.Marionette.ItemView.extend({
	// 	template: Templates['./client/apps/sidebar/templates/sidebar.html.handlebars']
	// });

	// SubpanelView = Backbone.Marionette.ItemView.extend({
	// 	template: Templates['./client/apps/subpanel/templates/subpanel.html.handlebars']
	// });

	console.log('App initialied');

	return App;
})(Backbone, Marionette, $, _);
