// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Talk      =  mongoose.model('Talk')
      , _         =  require('underscore')

  // Include the posts controller
    var posts  =  require('./posts')


// Define main functions
  // Create a talk
    exports.create = function (req, res) {
      req.bubble.num_talks++
      req.post_type = 'talk'
      req.Post = Talk

      posts.create(req,res)
    }
