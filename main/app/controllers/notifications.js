// Include the models
  var mongoose      =  require('mongoose')
    , Notification  =  mongoose.model('Notification')


// Define main functions
  // Create a notification
    exports.create = function (req, res, next) {
      var bubble  =  req.bubble
        , user    =  req.user

      var description  =  user.name + ' posted ' + req.a_or_an +' ' + req.bubble_section + ' in ' + bubble.name

      var notification = new Notification({
          subscriptions: bubble.subscriptions
        , description: description
        , bubble: bubble.id
        , creator: user.id
      })

      notification.save(function(err){
        if (err) {
          console.log("error creating notification: " + err)
        } else {
          next()
        }
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
