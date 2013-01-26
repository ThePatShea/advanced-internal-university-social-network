var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Event = mongoose.model('Event')
  , _ = require('underscore')


// View the list of events in a bubble
  exports.list = function(req, res) {
    res.render('events/new', { bubble: req.bubble }, function(err, new_post) {
      res.render('bubbles/list', {
          sidebar_buttons: req.sidebar_buttons
        , sidebar_top: req.sidebar_top
        , posts: req.bubble.events
        , bubble_section: 'event'
        , title: req.bubble.name
        , bubble: req.bubble
        , new_post: new_post
      })
    })
  }


// Create an event
exports.create = function (req, res) {
  var bubble = req.bubble

  var event = new Event(req.body)
  event.bubbles.addToSet(bubble._id)
  event.creator = req.user._id

  event.save(function(err) {
    if (err) {
      console.log("error creating event: " + err)
    } else {
      res.redirect('/bubbles/'+bubble._id+'/events/'+event._id)
    }
  })
}


// View an event
exports.show = function(req, res) {
  res.render('bubbles/show_post', {
      comments: req.comments
    , title: req.bubble.name
    , bubble_section: 'event'
    , title: req.event.name
    , bubble: req.bubble
    , post: req.event
  })
}
