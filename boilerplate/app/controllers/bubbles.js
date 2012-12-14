var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , _ = require('underscore')


// New bubble
exports.new = function(req, res){
  res.render('bubbles/new', {
      title: 'New Bubble'
    , bubble: new Bubble({})
  })
}


// Create a bubble
exports.create = function (req, res) {
  var bubble = new Bubble(req.body)

  bubble.save(function(err){
    if (err) {
      console.log("error creating bubble: " + err)

      res.render('bubbles/new', {
          title: 'New Bubble'
        , bubble: bubble
        , errors: err.errors
      })
    }
    else {
      res.redirect('/bubbles/'+bubble._id)
    }
  })
}


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
