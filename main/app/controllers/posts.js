var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Event = mongoose.model('Event')
  , Deal = mongoose.model('Deal')
  , Talk = mongoose.model('Talk')
  , _ = require('underscore')


// View a list of posts in a bubble
  exports.list = function(req, res) {
    // Define the bubble
      var bubble = req.bubble

    // Determine which section of the bubble to send the user to
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

    // Find all the posts the current bubble has
      Post
        .find({ bubbles: req.bubble._id })
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
