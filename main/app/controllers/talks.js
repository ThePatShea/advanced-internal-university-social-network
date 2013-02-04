// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Talk      =  mongoose.model('Talk')
      , _         =  require('underscore')

  // Include the posts controller
    var posts  =  require('./posts')



// Define main functions
  // View the list of talks in a bubble
    exports.list = function(req, res) {
      req.bubble_section = 'talk'
      req.Post = Talk

      posts.list(req,res)
    }


  // Create a talk
    exports.create = function (req, res) {
      req.bubble.num_talks++
      req.post_type = 'talk'
      req.Post = Talk

      posts.create(req,res)
    }

 
  // View a talk
    exports.show = function(req, res) {
      var bubble = req.bubble
      var post = req.talk
      var post_type = 'talk'
  
      res.render('includes/post_description', {
        post: post
      }, function(err, post_description) {
        res.render('includes/post_widget', {
            bubble_section: post_type
          , bubble: bubble
          , post: post
        }, function(err, post_widget) {
          res.render('bubbles/show_post', {
              sidebar_buttons: req.sidebar_buttons
            , post_description: post_description
            , sidebar_top: req.sidebar_top
            , post_widget: post_widget
            , comments: req.comments
            , bubble_section: post_type
            , title: bubble.name
            , title: post.name
            , bubble: bubble
            , post: post
          })
        })
      })
    }
