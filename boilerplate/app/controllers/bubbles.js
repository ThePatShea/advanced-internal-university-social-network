var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , _ = require('underscore')


// View a bubble
exports.show = function(req, res){
  console.log("bubbles.js -- " + req.bubble)

  res.render('bubbles/show', {
    sidebar_name: req.bubble.name,
    title: req.bubble.name,
    bubble: req.bubble
  })
}
