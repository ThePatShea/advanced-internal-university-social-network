// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Deal      =  mongoose.model('Deal')
      , _         =  require('underscore')
  
  // Include the base controllers
    var posts     =  require('./posts')


// Define main functions
  // Create a deal
    exports.create = function (req, res) {
      req.bubble.num_deals++
      req.post_type = 'deal'
      req.Post = Deal

      posts.create(req,res)
    }
