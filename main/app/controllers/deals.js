// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Deal      =  mongoose.model('Deal')
      , _         =  require('underscore')
  
  // Include the posts controller
    var posts  =  require('./posts')



// Define main functions
  // View the list of deals in a bubble
    exports.list = function(req, res) {
      req.bubble_section = 'deal'
      req.Post = Deal
  
      posts.list(req,res)
    }
  
  
  // Create a deal
    exports.create = function (req, res) {
      var bubble = req.bubble
      bubble.num_deals++
    
      bubble.save(function (err) {
        var deal = new Deal(req.body)
        deal.bubbles.addToSet(bubble._id)
        deal.creator = req.user._id
    
        deal.save(function(err){
          if (err) {
            console.log("error creating deal: " + err)
          } else {
            res.redirect('/bubbles/'+bubble._id+'/deals/'+deal._id)
          }
        })
    
      })
    }
  
  
  // View a deal
    exports.show = function(req, res) {
      var bubble = req.bubble
      var deal = req.deal
  
      res.render('includes/post_description', {
        post: deal
      }, function(err, post_description) {
        res.render('includes/post_widget', {
            bubble_section: 'deal'
          , bubble: bubble
          , post: deal
        }, function(err, post_widget) {
          res.render('bubbles/show_post', {
              sidebar_buttons: req.sidebar_buttons
            , post_description: post_description
            , sidebar_top: req.sidebar_top
            , post_widget: post_widget
            , comments: req.comments
            , bubble_section: 'deal'
            , title: bubble.name
            , title: deal.name
            , bubble: bubble
            , post: deal
          })
        })
      })
    }
