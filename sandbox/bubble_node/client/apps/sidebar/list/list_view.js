App.module("SidebarApp.List", function(List, App, Backbone, Marionette, $, _){

	List.Nav = Marionette.ItemView.extend({
		id: function() { return this.model.get('cssId'); },
		template: "sidebar/templates/nav",
		tagName: "li",
		modelEvents: {
			"change:chosen" : "changeChosen"
		},
		triggers: {
			"click" : "nav:clicked"
		},
		changeChosen: function(model, value, options){
			this.$el.toggleClass("active", value)
		},
		templateHelpers: function(){
			var icon = this.model.get("name").toLowerCase()
			renderedIcon = App.getTemplate("sidebar/templates/icons/" + icon)

			return { icon: renderedIcon }
		},
	})

	List.Navs = Marionette.CollectionView.extend({
		tagName: "ul",
		className: "sidebar-menu",
		itemView: List.Nav
	});

});
