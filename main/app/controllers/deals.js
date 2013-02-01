var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Deal = mongoose.model('Deal')
  , _ = require('underscore')


// View the list of deals in a bubble
  exports.list = function(req, res) {
    // Find all the deals the current bubble has
      Deal
        .find({ bubbles: req.bubble._id })
        .exec(function (err, deals) {
          // Render the view
            res.render('deals/new', {bubble: req.bubble }, function(err, new_post) {
              res.render('bubbles/list', {
                  sidebar_buttons: req.sidebar_buttons
                , sidebar_top: req.sidebar_top
                , title: req.bubble.name
                , bubble_section: 'deal'
                , bubble: req.bubble
                , new_post: new_post
                , posts: deals
              })
            })
         }) 
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
    res.render('bubbles/show_post', {
        sidebar_buttons: req.sidebar_buttons
      , sidebar_top: req.sidebar_top
      , comments: req.comments
      , bubble_section: 'deal'
      , title: req.deal.name
      , bubble: req.bubble
      , post: req.deal
    })
  }
