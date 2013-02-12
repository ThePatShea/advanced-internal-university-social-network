// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Deal      =  mongoose.model('Deal')
      , _         =  require('underscore')
  
  // Include the base controllers
    var uploads   =  require('./uploads')
    var posts     =  require('./posts')



// Define main functions
  // View the list of deals in a bubble
    exports.list = function(req, res) {
      req.bubble_section = 'deal'
      posts.list(req,res)
    }
 
  // Create a deal
    exports.create = function (req, res) {
      req.bubble.num_deals++
      req.post_type = 'deal'
      req.Post = Deal

      posts.create(req,res)
    }

  // View a deal
    exports.show = function(req, res) {
      req.post_type = 'deal'
      req.post = req.deal

      posts.show(req,res)
    }
