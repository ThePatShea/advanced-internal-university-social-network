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
        user.subscriptions.addToSet({_id: bubble._id})
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
        user.subscriptions.remove({_id: bubble._id})
        user.save(function (err) {
          res.redirect(req.body.current_url)
        })
      })
    }
  
  
  // Add an admin
    exports.add_admin = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.admin.addToSet(bubble._id)
      bubble.connections.users.admins.addToSet(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          next()
        })
      })

    }

  
  // Create a bubble
    exports.create = function (req, res, next) {
      var bubble      =  new Bubble(req.body)
      bubble.creator  =  req.user
  
      bubble.save(function(err) {
        req.body.current_url = '/bubbles/' + bubble._id
        req.bubble = bubble
        next()
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


  // Update the number of each connection a bubble has
    exports.count_connections = function(req, res) {
      var bubble = req.bubble

      bubble.num_connections = {
          num_posts: {
              num_total:   bubble.connections.posts.events.length + bubble.connections.talks.length
            , num_events:  bubble.connections.posts.events.length
            , num_talks:   bubble.connections.posts.talks.length
          }
        , num_users: {
              num_total:   bubble.connections.users.members.length + bubble.connections.users.admins.length + bubble.connections.users.fans.length
            , num_members: bubble.connections.users.members.length
            , num_admins:  bubble.connections.users.admins.length
            , num_fans:    bubble.connections.users.fans.length
          }
      }
    }
