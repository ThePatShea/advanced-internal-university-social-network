
var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Deal = mongoose.model('Deal')
  , _ = require('underscore')


// Create a deal
exports.create = function (req, res) {
  var bubble = req.bubble

  bubble.num_deals++
    bubble.save(function (err) {

    var deal = new Deal(req.body)
    deal.creator = req.user._id
    deal.bubbles.addToSet(bubble._id)

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
exports.show = function(req, res){
  res.render('bubbles/show_post', {
    title: req.deal.name,
    post: req.deal,
    sidebar_name: req.bubble.name,
    bubble: req.bubble,
    comments: req.comments,
    num_events: req.bubble.events.length,
    user_subscribed: req.user_subscribed,
    bubble_section: 'deal'
  })
}


// View the list of deals in a bubble
exports.list = function(req, res){

  // Check if the user is subscribed to this bubble
    if (req.user.subscriptions.indexOf(req.bubble._id) >= 0) {
      var user_subscribed = 1
    } else {
      var user_subscribed = 0
    }

   // Find all the deals the current bubble has
     Deal
       .find({ bubbles: req.bubble._id })
       .exec(function (err, deals) {

         // Render the view
           res.render('deals/new', {bubble: req.bubble },function(err, new_post) {
             if (err) console.log(err)
       
             res.render('bubbles/list', {
                 sidebar_name: req.bubble.name
               , title: req.bubble.name
               , bubble: req.bubble
               , posts: deals
               , num_events: req.bubble.events.length
               , user_subscribed: user_subscribed
               , bubble_section: 'deal'
               , new_post: new_post
             })

           })

        }) 
}
