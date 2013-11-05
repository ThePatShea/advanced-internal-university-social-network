App.module("SidebarApp.List", function(List, App, Backbone, Marionette, $, _){
	List.View = Marionette.ItemView.extend({
		template: Templates['./client/apps/sidebar/templates/sidebar.html.handlebars'],

		events: {
			'click #dashboard': 'dashboardClick',
			'click #mybubbles': 'mybubblesClick',
			'click #explore': 'exploreClick',
			'click #search': 'searchClick',
			'click #settings': 'settingsClick'
		},

		initialize: function(options){
			this.vent = App.vent;
		},

		dashboardClick: function(){
			console.log('view: dashboardClick');
			this.vent.trigger('sidebar:dashboardClick');
		},

		mybubblesClick: function(){
			console.log('view: mybubblesClick');
			this.vent.trigger('sidebar:mybubblesClick');
		},

		exploreClick: function(){
			console.log('view: exploreClick');
			this.vent.trigger('sidebar:exploreClick');
		},

		searchClick: function(){
			console.log('view: searchClick');
			this.vent.trigger('sidebar:searchClick');
		},

		settingsClick: function(){
			console.log('view: settingsClick');
			this.vent.trigger('sidebar:settingsClick');
		}
	});
});