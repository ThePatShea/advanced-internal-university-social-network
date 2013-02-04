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
      req.Post = Event
  
      posts.list(req,res)
    }
  

  // Create an event
    exports.create = function (req, res) {
      req.bubble.num_events++
      req.post_type = 'event'
      req.Post = Event
      
      posts.create(req,res)
    }
  
  
  // View an event
    exports.show = function(req, res) {
      var bubble = req.bubble
      var event = req.event
      
      res.render('includes/post_description', {
        post: event
      }, function(err, post_description) {
        res.render('includes/post_widget', {
            format_date_bottom_count: 0
          , format_date_top_count: 0
          , bubble_section: 'event'
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
