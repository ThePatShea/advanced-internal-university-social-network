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
    var bubble = req.bubble
    var event = req.event
    
    res.render('includes/post_description', {
      post: event
    }, function(err, post_description) {
      res.render('includes/post_widget', {
          bubble_section: 'event'
        , bubble: bubble
        , post: event
      }, function(err, post_widget) {
        res.render('bubbles/show_post', {
            sidebar_buttons: req.sidebar_buttons
          , post_description: post_description
          , sidebar_top: req.sidebar_top
          , post_widget: post_widget
          , comments: req.comments
          , bubble_section: 'event'
          , title: bubble.name
          , title: event.name
          , bubble: bubble
          , post: event
        })
      })
    })
  }


// Edit an event
  exports.edit = function(req, res) {
    var bubble = req.bubble
    var event = req.event
     
    res.render('includes/post_description_edit', {
        post: event
      }, function(err, post_description) {
      res.render('includes/post_widget_edit', {
          bubble_section: 'event'
        , bubble: bubble
        , post: event
      }, function(err, post_widget) {
        res.render('bubbles/show_post', {
            sidebar_buttons: req.sidebar_buttons
          , post_description: post_description
          , sidebar_top: req.sidebar_top
          , post_widget: post_widget
          , comments: req.comments
          , bubble_section: 'event'
          , title: bubble.name
          , title: event.name
          , bubble: bubble
          , post: event
        })
      })
    })
  }


// Update an event
  exports.update = function(req, res) {
    var bubble = req.bubble
    var event = req.event
     
    event = _.extend(event, req.body)

    event.save(function(err, doc) {
      res.redirect('/bubbles/'+bubble._id+'/events/'+event._id)
    })
  }
