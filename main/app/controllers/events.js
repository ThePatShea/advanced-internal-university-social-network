// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Event     =  mongoose.model('Event')
      , _         =  require('underscore')

  // Include the posts controller
    var posts  =  require('./posts')



// Define main functions
  // View the list of events in a bubble
    exports.list = function(req, res) {
      req.bubble_section = 'event'
      posts.list(req,res)
    }

  // View a subset of the list of events in a bubble
    exports.list_pagelet = function(req, res) {
      req.bubble_section = 'event'
      req.Post = Event
       
      // Initialize query parameters
        var timestamp_now            =  (new Date()) / 1000
        var timestamp_six_hours_ago  =  timestamp_now - 21600
        req.query_parameters_find    =  { end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_six_hours_ago} }
        req.query_parameters_sort    =  { start_time: 'asc' } 

      posts.list_pagelet(req,res)
    }

  // Create an event
    exports.create = function (req, res) {
      req.bubble.num_events++
      req.post_type = 'event'
      req.Post = Event

      // Convert start_time and end_time to unix timestamp
        req.body.start_time  =  ( Date.parse(req.body.start_time) ) / 1000
        req.body.end_time    =  ( Date.parse(req.body.end_time)   ) / 1000

      posts.create(req,res)
    }
 
  // View an event
    exports.show = function(req, res) {
      req.post_type = 'event'
      req.post = req.event

      posts.show(req,res)
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
