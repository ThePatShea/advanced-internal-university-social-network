// Include the models
  var mongoose      =  require('mongoose')
    , Notification  =  mongoose.model('Notification')
    , User          =  mongoose.model('User')


// Define main functions
  // Create a notification
    exports.create = function (req, res, next) {
      var bubble_section  =  req.bubble_section
        , bubble          =  req.bubble
        , post            =  req.post
        , user            =  req.user

      // Determine which users get the notification
        var notification_subscribers = bubble.connections.users.admins.concat(bubble.connections.users.members)

        // if (post.privacy == 'public')
          // notification_subscribers = notification_subscribers.concat(bubble.connections.users.fans)


      var notification = new Notification({
          description: user.name + ' posted ' + req.a_or_an +' ' + bubble_section + ' in ' + bubble.name
        , connections: {
              users: {
                  subscribers: notification_subscribers
                , creator:     user.id
              }
            , bubble: bubble.id
            , post: {
                  post_type: bubble_section
                , _id: post._id
              }
          }
      })

      notification.connections.users.subscribers.remove(user.id)  // Makes it so the creator doesn't get a notification

      notification.save(function(err) {
        User
         .update({ _id: {$in: notification.connections.users.subscribers} },{ $inc: {total_unviewed_notifications: 1} })
         .exec(function(err, user) {
           req.body.redirect_url = '/bubbles/' + bubble._id + '/' + bubble_section + '/view/' + post._id
           next()
         })
      })
    }


  // View a list of notifications for a user
    exports.list = function(req, res) {

      res.render('notifications/list', {
          list_pagelet_url: '/notifications/list_pagelet/'
        , rendered_sidebar: req.rendered_sidebar
        , title: 'notifications'
      })
    }


  // View a subset of a list of posts in a bubble
    exports.list_pagelet = function(req, res) {
      var skip  =  req.params.skip

      Notification
        .find({ 'connections.users.subscribers': req.user._id })
        .sort({ 'createdAt': 'desc' })
        .limit(20)
        .skip(skip)
        .populate('connections.users.creator')
        .exec(function (err, notifications) {
          res.render('notifications/list_pagelet', {
              notifications: notifications
            , skip: skip
          })
        })
    }


  // Reset a user's count of unseen notifications
    exports.reset_unviewed = function(req, res, next) {
      req.user.total_unviewed_notifications = 0

      req.user.save(function(err) {
        next()
      })
  }


  // Delete notifications
    exports.delete = function(req, res, next) {
      Notification
        .remove(req.notification_delete_parameters, function(err) {
          next()
        })
    }
