
var mongoose = require('mongoose')
  , Event = mongoose.model('Event')
  , _ = require('underscore')


// View an event
exports.show = function(req, res){
  console.log("req.bubble: "+req.bubble);

  res.render('events/show', {
    title: req.event.name,
    event: req.event,
    sidebar_name: req.bubble.name,
    title: req.bubble.name,
    bubble: req.bubble,
    num_events: req.bubble.events.length
  })
}



