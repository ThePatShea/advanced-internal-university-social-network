var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , _ = require('underscore')


// View a bubble
exports.show = function(req, res){
  res.render('bubbles/show', {
    sidebar_name: req.bubble.name,
    title: req.bubble.name,
    bubble: req.bubble,
    num_events: req.bubble.events.length
  })
}

// View subscriptions
exports.subscriptions = function(req, res){
  Bubble
    .find({}, "name")
    .exec(function(err, bubbles) {
      if (err) return res.render('500')
      res.render('bubbles/subscriptions', {
        sidebar_name: 'subscriptions',
        title: 'subscriptions',
        bubbles: bubbles
      })
    })
}
