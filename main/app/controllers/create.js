exports.show = function(req, res){
  res.render('create/show', {
    sidebar_name: 'Create',
    title: 'Create'
  })
}
