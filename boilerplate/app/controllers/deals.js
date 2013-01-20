
var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Deal = mongoose.model('Deal')
  , _ = require('underscore')


// Create a deal
exports.create = function (req, res) {
  var bubble = req.bubble

  var event = new Event(req.body)
  event.creator = req.user._id
  event.bubbles.addToSet(bubble._id)

  event.save(function(err){
    if (err) {
      console.log("error creating event: " + err)
    } else {
      res.redirect('/bubbles/'+bubble._id+'/events/'+event._id)
    }
  })
}


// View a deal
exports.show = function(req, res){
  res.render('events/show', {
    title: req.event.name,
    event: req.event,
    sidebar_name: req.bubble.name,
    title: req.bubble.name,
    bubble: req.bubble,
    num_events: req.bubble.events.length,
    comments: req.comments,
    user_subscribed: req.user_subscribed
  })
}


// View the list of deals in a bubble
exports.list = function(req, res){

  // Check if the user is subscribed to this bubble
    if (req.user.subscriptions.indexOf(req.bubble._id) >= 0) {
      var user_subscribed = 1
    } else {
      var user_subscribed = 0
    }

  // Render the view
    res.render('deals/list', {
        sidebar_name: req.bubble.name
      , title: req.bubble.name
      , bubble: req.bubble
      , num_events: req.bubble.events.length
      , user_subscribed: user_subscribed
    })
 
}
