App.module("SidebarApp.List", function(List, App, Backbone, Marionette, $, _){

	List.Nav = Marionette.ItemView.extend({
		id: function() { return this.model.get('cssId'); },
		template: "sidebar/templates/nav",
		tagName: "li",
    ui: {
      button: "button"
    },
		modelEvents: {
			"change:chosen" : "changeChosen"
		},
		triggers: {
			"click" : "nav:clicked"
		},
		changeChosen: function(model, value, options){
      this.ui.button.toggleClass("active", value)
		},
		templateHelpers: function(){
			var icon = this.model.get("navName")
			renderedIcon = App.getTemplate("sidebar/templates/icons/" + icon)

			return { icon: renderedIcon }
		},
	})

  List.Navs = Marionette.CompositeView.extend({
    template: 'sidebar/templates/sidebar',
    itemView: List.Nav,
    itemViewContainer: 'ul.sidebar-menu'
  });

});
