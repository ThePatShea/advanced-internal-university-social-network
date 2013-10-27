define(["text!person_view.html", "text!details_view.html", "text!address_view.html", "thorax"], function(person, details, address) {
  return {
    personView: Handlebars.compile(person),
    personDetails: Handlebars.compile(details),
    personAddress: Handlebars.compile(address)
  }
});