App.module("SidebarApp.List", function(List, App, Backbone, Marionette, $, _){

	List.Layout = Marionette.Layout.extend({
		template: 'sidebar/templates/sidebar_layout',

		regions: {
			sidebarMain: '#sidebar_container',
			subpanel:    '#subpanel_container'
		}
	});

	List.SubpanelView = Marionette.ItemView.extend({
		template: 'subpanel/templates/subpanel'
	});

	List.Controller = App.Controllers.Base.extend({
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
			return new List.View();
		},

		getSubpanelView: function(){
			return new List.SubpanelView();
		},

		getLayout: function(){
			return new List.Layout();
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