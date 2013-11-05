$(function() {
	App.start()
});

//Backbone-Marionette App goes here
window.App = (function(Backbone, Marionette, $, _){

	var App = new Backbone.Marionette.Application();

	App.addRegions({
		header: '#header_container',
		sidebar: '#sidebar_container',
		subpanel: '#subpanel_container'
	});

	App.addInitializer(function() {
		App.module("HeaderApp").start();
		App.SidebarApp.start();
		// var v = new SubpanelView();
		// App.subpanel.show(v);
		// App.module("FooterApp").start()
	})

	// SidebarView = Backbone.Marionette.ItemView.extend({
	// 	template: Templates['./client/apps/sidebar/templates/sidebar.html.handlebars']
	// });

	// SubpanelView = Backbone.Marionette.ItemView.extend({
	//    template: Templates['./client/apps/subpanel/templates/subpanel.html.handlebars']
	// });

	console.log('App initialied');

	return App;
})(Backbone, Marionette, $, _);
