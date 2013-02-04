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
      req.post_type = 'talk'
      req.post = req.talk

      posts.show(req,res)
    }
