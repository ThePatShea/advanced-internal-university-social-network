App.module("SidebarApp.Menu", function(Menu, App, Backbone, Marionette, $, _){
	Menu.Controller = App.Controllers.Base.extend({
		initialize: function(options){
			sidebarView = this.getView();
			options.region.show(sidebarView);
		},

		getView: function(){
			return new Menu.View();
		}
	});
});