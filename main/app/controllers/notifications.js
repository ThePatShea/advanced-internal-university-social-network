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

      var description  =  user.name + ' posted ' + req.a_or_an +' ' + bubble_section + ' in ' + bubble.name

      // Remove the post creator from the list of people who get the notification
        var subscriptions = bubble.subscriptions
        subscriptions.remove(user.id)

      var notification = new Notification({
          subscriptions: subscriptions
        , description: description
        , bubble: bubble.id
        , creator: user.id
        , post: {
              post_type: bubble_section
            , _id: post._id
          }
      })

      notification.save(function(err) {
        User
         .update({_id: {$in: subscriptions} },{ $inc: {total_unseen_notifications: 1} })
         .exec(function(err, user) {
           res.redirect('/bubbles/'+bubble._id+'/'+bubble_section+'/view/'+post._id)
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
      console.log('req.user._id: ' + req.user._id) // TESTING
      Notification
        .find({ subscriptions: req.user._id })
        .sort({ createdAt: 'desc' })
        .limit(20)
        .skip(skip)
        .populate('creator')
        .exec(function (err, notifications) {
            res.render('notifications/list_pagelet', {
                notifications: notifications
              , skip: skip
            })
         })
    }
