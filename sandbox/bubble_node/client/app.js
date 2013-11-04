//Backbone-Marionette App goes here
$(document).ready(function(){
	var app = new Backbone.Marionette.Application();

	app.addRegions({
		header: '#header_container',
		sidebar: '#sidebar_container'
	});

	TopBarView = Backbone.Marionette.ItemView.extend({
		template: Templates['./client/apps/header/templates/top_bar.html.handlebars']
	});

	SidebarView = Backbone.Marionette.ItemView.extend({
		template: Templates['./client/apps/sidebar/templates/sidebar.html.handlebars']
	});

	var view1 = new TopBarView();
	var view2 = new SidebarView();

	app.header.show(view1);
	app.sidebar.show(view2);
	console.log('App running');
});
