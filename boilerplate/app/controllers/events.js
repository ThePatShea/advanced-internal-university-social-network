
var mongoose = require('mongoose')
  , Event = mongoose.model('Event')
  , _ = require('underscore')


console.log("events.js")

// View an event
exports.show = function(req, res){
  console.log("events.js -- exports.show -- " + req)
  res.render('events/show', {
    title: req.event.name,
    event: req.event
  })
}



