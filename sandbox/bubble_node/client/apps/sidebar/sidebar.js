App.module("SidebarApp", function(SidebarApp, App, Backbone, Marionette, $, _){
	this.startWithParent = false;

	this.API = {
		show: function(){
			SidebarApp.controller = new SidebarApp.Menu.Controller({region: App.sidebar});
		}
	}

	SidebarApp.on('start', function(){
		SidebarApp.API.show();
	});
});