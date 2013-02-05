// Include the models
  var mongoose = require('mongoose')
    , Bubble = mongoose.model('Bubble')
    , Event = mongoose.model('Event')
    , Deal = mongoose.model('Deal')
    , Talk = mongoose.model('Talk')
    , _ = require('underscore')



// Define main functions
  // View a list of posts in a bubble
    exports.list = function(req, res) {
      // Define the bubble
        var bubble = req.bubble
  
      // Determine which section of the bubble to send the user to
        if (req.bubble_section != undefined) {
          bubble_section = req.bubble_section
          Post = req.Post
        } else {
          if (bubble.num_events > 0) {
            var bubble_section = 'event'
            Post = Event
          } else if (bubble.num_deals > 0) {
            var bubble_section = 'deal'
            Post = Deal
          } else if (bubble.num_talks > 0) {
            var bubble_section = 'talk'
            Post = Talk
          } else {
            var bubble_section = 'event'
            Post = Event
          }
        }

      // Initialize query parameters
        var timestamp_now = (new Date()) / 1000
        var timestamp_yesterday = timestamp_now - 86400

  
      // Find all the posts the current bubble has
        Post
          .find({ bubbles: req.bubble._id, end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_yesterday} })
          .sort({ start_time: 'asc' })
          .limit(20)
          .exec(function (err, posts) {
            // Render the view
              res.render(bubble_section+'s/new', {bubble: req.bubble }, function(err, new_post) {
                res.render('bubbles/list', {
                    sidebar_buttons: req.sidebar_buttons
                  , bubble_section: bubble_section
                  , sidebar_top: req.sidebar_top
                  , format_date_bottom_count: 0
                  , format_date_top_count: 0
                  , title: req.bubble.name
                  , bubble: req.bubble
                  , new_post: new_post
                  , posts: posts
                })
              })
           }) 
    }


  // View a subset of a list of posts in a bubble
    exports.list_pagelet = function(req, res) {
      // Define the bubble parameters
        var bubble_section  =  req.bubble_section
        var skip            =  req.params.skip
        var bubble          =  req.bubble

      // Determine which section of the bubble this is
        Post = req.Post
 
      // Find some posts the current bubble has
        Post
          .find({ bubbles: req.bubble._id })
          .limit(20)
          .skip(skip)
          .exec(function (err, posts) {
            // Render the view
              res.render('bubbles/list_pagelet', {
                  bubble_section: bubble_section
                , format_date_bottom_count: skip
                , format_date_top_count: skip
                , bubble: bubble
                , posts: posts
              })
           })
    }


  // Create a post
    exports.create = function (req, res) {
      var bubble = req.bubble
      Post = req.Post

      bubble.save(function (err) {
        var post = new Post(req.body)
        post.bubbles.addToSet(bubble._id)
        post.creator = req.user._id

        post.save(function(err){
          if (err) {
            console.log("error creating post: " + err)
          } else {
            res.redirect('/bubbles/'+bubble._id+'/'+req.post_type+'s/'+post._id)
          }
        })

      })
    }


  // View a post
    exports.show = function(req, res) {
      var post_type = req.post_type
      var bubble = req.bubble
      var post = req.post

      res.render('includes/post_description', {
        post: post
      }, function(err, post_description) {
        res.render('includes/post_widget', {
            format_date_bottom_count: 0
          , bubble_section: post_type
          , format_date_top_count: 0
          , bubble: bubble
          , post: post
        }, function(err, post_widget) {
          res.render('bubbles/show_post', {
              sidebar_buttons: req.sidebar_buttons
            , post_description: post_description
            , sidebar_top: req.sidebar_top
            , bubble_section: post_type
            , post_widget: post_widget
            , comments: req.comments
            , title: post.name
            , bubble: bubble
            , post: post
          })
        })
      })
    }
