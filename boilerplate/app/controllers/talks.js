var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , Talk = mongoose.model('Talk')
  , _ = require('underscore')


// View the list of talks in a bubble
  exports.list = function(req, res) {
    // Find all the talks the current bubble has
      Talk
        .find({ bubbles: req.bubble._id })
        .exec(function (err, talks) {
          // Render the view
            res.render('talks/new', {bubble: req.bubble }, function(err, new_post) {
              res.render('bubbles/list', {
                  sidebar_buttons: req.sidebar_buttons
                , sidebar_top: req.sidebar_top
                , title: req.bubble.name
                , bubble_section: 'talk'
                , bubble: req.bubble
                , new_post: new_post
                , posts: talks
              })
            })
         }) 
  }


// Create a talk
  exports.create = function (req, res) {
    var bubble = req.bubble
    bubble.num_talks++

    bubble.save(function (err) {
      var talk = new Talk(req.body)
      talk.bubbles.addToSet(bubble._id)
      talk.creator = req.user._id
  
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
  exports.show = function(req, res) {
    res.render('bubbles/show_post', {
        comments: req.comments
      , bubble_section: 'talk'
      , title: req.talk.name
      , bubble: req.bubble
      , post: req.talk
    })
  }
