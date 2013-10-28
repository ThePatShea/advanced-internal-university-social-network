define(["text!sidebar_view.html", "thorax"], function(sidebar) {
  return {
    sidebarView: Handlebars.compile(sidebar)
  }
});