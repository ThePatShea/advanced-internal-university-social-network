//Backbone-Marionette App goes here
$(document).ready(function(){
	var app = new Backbone.Marionette.Application();

	app.addRegions({
		header: '#header_container',
		sidebar: '#sidebar_container',
		subpanel: '#subpanel_container'
	});

	TopBarView = Backbone.Marionette.ItemView.extend({
		template: Templates['./client/apps/header/templates/top_bar.html.handlebars']
	});

	SidebarView = Backbone.Marionette.ItemView.extend({
		template: Templates['./client/apps/sidebar/templates/sidebar.html.handlebars']
	});

	SubpanelView = Backbone.Marionette.ItemView.extend({
		template: Templates['./client/apps/subpanel/templates/subpanel.html.handlebars']
	});

	var view1 = new TopBarView();
	var view2 = new SidebarView();
	var view3 = new SubpanelView();

	app.header.show(view1);
	app.sidebar.show(view2);
	app.subpanel.show(view3);
	console.log('App running');
});
