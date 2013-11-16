App.getTemplate = function(templateLookup, data) {
  data = data || {};

  lookupRoots = ["./client/apps", "./client/components"];

  var lookups = _(lookupRoots).map(function(root) {
    return root + "/" + templateLookup + ".html.handlebars";
  });

  // Find the first one that exists
  var path = _.find(lookups, function(lookup){
    return Templates[lookup]
  });

  return Templates[path](data);
};

_.extend(Marionette.Renderer, {
  render: function(template, data) {
    return App.getTemplate(template, data);
  }
});
