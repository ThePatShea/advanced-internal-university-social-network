App.module("SidebarApp.List", function(List, App, Backbone, Marionette, $, _){

	List.Controller = App.Controllers.Base.extend({
		initialize: function(options){
			var navsView = this.getNavView(options.navs);

			this.listenTo(navsView, "itemview:nav:clicked", function(iv, obj){
				App.vent.trigger("nav:clicked", obj.model);
			});

			this.show(navsView);
		},

		getNavView: function(navs){
			return new List.Navs({collection: navs});
		},
	});

});
