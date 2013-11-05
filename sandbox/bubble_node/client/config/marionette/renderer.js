_.extend(Marionette.Renderer, {
  render: function(template, data) {
    templatePath = './client/apps/' + template + '.html.handlebars'
    return Templates[templatePath](data)
  }
})
