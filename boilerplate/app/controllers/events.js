
var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Event = mongoose.model('Event')
  , _ = require('underscore')


// Create an event
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


// View an event
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
