// Include the models
  var mongoose  =  require('mongoose')
    , Bubble    =  mongoose.model('Bubble')
    , _         =  require('underscore')


// Define main functions
  // Redirect a user to a section of a bubble
    exports.redirect = function(req, res) {
      var bubble = req.bubble

      if (bubble.num_events > 0) {
        res.redirect('/bubbles/'+bubble._id+'/event')
      } else if (bubble.num_deals > 0) {
        res.redirect('/bubbles/'+bubble._id+'/deal')
      } else if (bubble.num_talks > 0) {
        res.redirect('/bubbles/'+bubble._id+'/talk')
      } else {
        res.redirect('/bubbles/'+bubble._id+'/event')
      }
    }
  
  
  // Subscribe to a bubble
    var subscribe = exports.subscribe = function (req, res) {
      var bubble  =  req.bubble
        , user    =  req.user
      
      bubble.subscriptions.addToSet(user._id)
      bubble.num_subscriptions++

      bubble.save(function (err) {
        user.subscriptions.addToSet(bubble._id)
        user.save(function (err) {
          res.redirect(req.body.current_url)
        })
      })
    }
  
  
  // Unsubscribe from a bubble
    exports.unsubscribe = function (req, res) {
      var bubble  =  req.bubble
        , user    =  req.user
       
      bubble.subscriptions.remove(user._id)
      bubble.num_subscriptions--

      bubble.save(function (err) {
        user.subscriptions.remove(bubble._id)
        user.save(function (err) {
          res.redirect(req.body.current_url)
        })
      })
    }
  
  
  // Create a bubble
    exports.create = function (req, res) {
      var bubble = new Bubble(req.body)
      bubble.creator = req.user
      bubble.privacy = "CLOSED"
  
      bubble.save(function(err) {
        req.body.current_url = '/bubbles/' + bubble._id
        req.bubble = bubble
        subscribe(req,res)
      })
    }
  
  
  // Edit a bubble
    exports.edit = function(req, res) {
      var bubble = req.bubble
       
      res.render('bubbles/edit', {
          rendered_sidebar: req.rendered_sidebar
        , bubble_section: 'none'
        , title: bubble.name
        , bubble: bubble
      })
    }
  
  
  // Update a bubble
    exports.update = function(req, res) {
      var bubble = req.bubble
    
      bubble = _.extend(bubble, req.body)
    
      bubble.save(function(err, doc) {
        res.redirect('/bubbles/'+bubble._id)
      })
    }
