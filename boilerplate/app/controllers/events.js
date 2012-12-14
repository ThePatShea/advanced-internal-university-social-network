
var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Event = mongoose.model('Event')
  , _ = require('underscore')


// New event
exports.new = function(req, res){
  Bubble
    .find({privacy : "OPEN"}, "name")
    .exec(function(err, public_bubbles) {
      if (err) return res.render('500')


      Bubble
        .find({creator : req.user._id}, "name")
        .exec(function(err, your_bubbles) {
          if (err) return res.render('500')


          res.render('events/new', {
              title: 'Create an Event'
            , sidebar_name: 'Create'
            , bubble: new Event({})
            , event: new Event({})
            , public_bubbles: public_bubbles
            , your_bubbles: your_bubbles
          })
        })
    })
}


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
