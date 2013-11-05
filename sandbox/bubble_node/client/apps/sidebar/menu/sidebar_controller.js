App.module("SidebarApp.Menu", function(Menu, App, Backbone, Marionette, $, _){

	Menu.Layout = Marionette.Layout.extend({
		template: Templates['./client/apps/sidebar/templates/sidebar_layout.html.handlebars'],

		regions: {
			sidebarMain: '#sidebar_container',
			subpanel:    '#subpanel_container'
		}
	});

	Menu.SubpanelView = Marionette.ItemView.extend({
		template: Templates['./client/apps/subpanel/templates/subpanel.html.handlebars']
	});

	Menu.Controller = App.Controllers.Base.extend({
		initialize: function(options){
			// sidebarView = this.getView();
			// options.region.show(sidebarView);
			this.vent = App.vent;
			var sidebarLayout = this.getLayout();
			options.region.show(sidebarLayout);
			var menuView = this.getView();
			sidebarLayout.sidebarMain.show(menuView);

			this.vent.on('sidebar:exploreClick', this.showSubpanel(sidebarLayout));
			this.vent.on('sidebar:mybubblesClick', this.showSubpanel(sidebarLayout));
			this.vent.on('sidebar:dashboardClick', this.hideSubpanel(sidebarLayout));
			this.vent.on('sidebar:searchClick', this.hideSubpanel(sidebarLayout));
			this.vent.on('sidebar:settingsClick', this.hideSubpanel(sidebarLayout));
		},

		getView: function(){
			return new Menu.View();
		},

		getSubpanelView: function(){
			return new Menu.SubpanelView();
		},

		getLayout: function(){
			return new Menu.Layout();
		},

		showSubpanel: function(sidebarLayout){
			var subpanelView = this.getSubpanelView();

			return function(){
				sidebarLayout.subpanel.show(subpanelView);
			}
		},

		hideSubpanel: function(sidebarLayout){
			return function(){
				sidebarLayout.subpanel.close();
				//sidebarLayout.subpanel.reset();
			}
		}
	});
});