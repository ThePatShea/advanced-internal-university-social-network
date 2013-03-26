// Include the models
  var mongoose       =  require('mongoose')
    , Bubble         =  mongoose.model('Bubble')
    , _              =  require('underscore')

// Include other controllers
  var notifications  =  require('./notifications')



// Define main functions
  // Add a fan
    exports.add_fan = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.fan.addToSet(bubble._id)
      bubble.connections.users.fans.addToSet(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          next()
        })
      })
    }
  
  
  // Remove a fan
    exports.remove_fan = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.fan.remove(bubble._id)
      bubble.connections.users.fans.remove(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          next()
        })
      })
    }
  

  // Add an applicant
    exports.add_applicant = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.applicant.addToSet(bubble._id)
      bubble.connections.users.applicants.addToSet(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          next()
        })
      })
    }
  
  
  // Remove an applicant
    exports.remove_applicant = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.applicant.remove(bubble._id)
      bubble.connections.users.applicants.remove(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          next()
        })
      })
    }
  

  // Add a member
    exports.add_member = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.member.addToSet(bubble._id)
      bubble.connections.users.members.addToSet(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          next()
        })
      })
    }

  
  // Remove a member
    var bubble_remove_member = exports.remove_member = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.member.remove(bubble._id)
      bubble.connections.users.members.remove(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          next()
        })
      })
    }


  // Add an admin
    var bubble_add_admin = exports.add_admin = function (req, res, next) {
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

 
  // Remove an admin
    exports.remove_admin = function (req, res, next) {
      var user_selected  =  req.user_selected
        , bubble         =  req.bubble

      user_selected.connections.bubbles.admin.remove(bubble._id)
      bubble.connections.users.admins.remove(user_selected._id)

      user_selected.save(function (err) {
        bubble.save(function (err) {
          // If the last admin is leaving, assign a new admin or delete the bubble
            if (bubble.num_connections.num_users.num_admins == 1) { // 1 instead of 0 because bubble.count_connections hasn't run yet
              if (bubble.num_connections.num_users.num_members > 0) {
                req.user_selected      =  bubble.connections.users.members[0]
                req.body.redirect_url  =  '/bubbles/' + bubble._id
                
                bubble_add_admin(req, res, function() {
                  bubble_remove_member(req, res, next)
                })
              } else {
                bubble_delete(req,res)
              }
            } else {
              next()
            }
        })
      })
    }


  // Create a bubble
    exports.create = function (req, res, next) {
      var bubble = new Bubble(req.body)
  
      bubble.save(function(err) {
        req.body.redirect_url   =  '/bubbles/' + bubble._id
        req.user_selected       =  req.user
        req.bubble              =  bubble

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
  
  
  // Save edits to a bubble
    exports.update = function(req, res) {
      var bubble = req.bubble
    
      bubble = _.extend(bubble, req.body)
    
      bubble.save(function(err) {
        res.redirect('/bubbles/'+bubble._id)
      })
    }


  // Delete a bubble
    var bubble_delete = exports.delete = function(req, res) {
      var bubble = req.bubble

      bubble.remove(function(err) {
        req.notification_delete_parameters = {'connections.bubble': bubble._id}

        notifications.delete(req, res, function() {
          res.redirect('/')
        })
      })
    }


  // Update the number of each connection a bubble has
    exports.count_connections = function(req, res, next) {
      var bubble = req.bubble

      bubble.num_connections = {
          num_posts: {
              num_total:       bubble.connections.posts.events.length + bubble.connections.posts.talks.length
            , num_events:      bubble.connections.posts.events.length
            , num_talks:       bubble.connections.posts.talks.length
          }
        , num_users: {
              num_total:       bubble.connections.users.applicants.length + bubble.connections.users.members.length + bubble.connections.users.admins.length + bubble.connections.users.fans.length
            , num_applicants:  bubble.connections.users.applicants.length
            , num_members:     bubble.connections.users.members.length
            , num_admins:      bubble.connections.users.admins.length
            , num_fans:        bubble.connections.users.fans.length
          }
      }
      
      bubble.save(function(err) {
        res.redirect(req.body.redirect_url)
      })
    }
