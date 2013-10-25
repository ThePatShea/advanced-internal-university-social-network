define(["text!person_view.html", "text!details_view.html", "thorax"], function(person, details) {
  return {
    personView: Handlebars.compile(person),
    personDetails: Handlebars.compile(details)
  }
});