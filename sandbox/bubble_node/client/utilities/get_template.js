App.getTemplate = function(templateLookup, data) {
  data = data || {};

  templatePath = './client/apps/' + templateLookup + '.html.handlebars'
  return Templates[templatePath](data);
}

_.extend(Marionette.Renderer, {
  render: function(template, data) {
    return App.getTemplate(template, data);
  }
})
