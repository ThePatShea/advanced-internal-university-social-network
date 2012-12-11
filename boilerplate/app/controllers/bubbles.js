var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , _ = require('underscore')


// View a bubble
exports.show = function(req, res){
  console.log("bubbles.js -- " + req.bubble)

  res.render('bubbles/show', {
    title: req.bubble.name,
    bubble: req.bubble
  })
}
