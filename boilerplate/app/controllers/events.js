
var mongoose = require('mongoose')
  , Event = mongoose.model('Event')
  , _ = require('underscore')


// View an event
exports.show = function(req, res){
  res.render('events/show', {
    title: req.event.name,
    event: req.event
  })
}



