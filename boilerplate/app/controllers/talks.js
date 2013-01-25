
var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Talk = mongoose.model('Talk')
  , _ = require('underscore')


// Create a talk
exports.create = function (req, res) {
  var bubble = req.bubble

  bubble.num_talks++
    bubble.save(function (err) {

    var talk = new Talk(req.body)
    talk.creator = req.user._id
    talk.bubbles.addToSet(bubble._id)

    talk.save(function(err){
      if (err) {
        console.log("error creating talk: " + err)
      } else {
        res.redirect('/bubbles/'+bubble._id+'/talks/'+talk._id)
      }
    })

  })
}


// View a talk
exports.show = function(req, res){
  res.render('bubbles/show_post', {
    title: req.talk.name,
    post: req.talk,
    sidebar_name: req.bubble.name,
    bubble: req.bubble,
    comments: req.comments,
    user_subscribed: req.user_subscribed,
    bubble_section: 'talk'
  })
}


// View the list of talks in a bubble
exports.list = function(req, res){

  // Check if the user is subscribed to this bubble
    if (req.user.subscriptions.indexOf(req.bubble._id) >= 0) {
      var user_subscribed = 1
    } else {
      var user_subscribed = 0
    }

   // Find all the talks the current bubble has
     Talk
       .find({ bubbles: req.bubble._id })
       .exec(function (err, talks) {

         // Render the view
           res.render('talks/new', {bubble: req.bubble },function(err, new_post) {
             if (err) console.log(err)
       
             res.render('bubbles/list', {
                 sidebar_name: req.bubble.name
               , title: req.bubble.name
               , bubble: req.bubble
               , posts: talks
               , user_subscribed: user_subscribed
               , bubble_section: 'talk'
               , new_post: new_post
             })

           })

        }) 
}
