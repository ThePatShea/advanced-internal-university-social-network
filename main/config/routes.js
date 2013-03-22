// Instantiate the base classes
  // Instantiate the node modules
    var mongoose       =  require('mongoose')
      , async          =  require('async')
       
  // Instantiate the models
    var Notification   =  mongoose.model('Notification')
      , Bubble         =  mongoose.model('Bubble')
      , Event          =  mongoose.model('Event')
      , Talk           =  mongoose.model('Talk')
      , User           =  mongoose.model('User')
       
       
module.exports = function (app, passport, auth) {
  // Instantiate the controllers
    var notifications  =  require('../app/controllers/notifications')
      , comments       =  require('../app/controllers/comments')
      , bubbles        =  require('../app/controllers/bubbles')
      , uploads        =  require('../app/controllers/uploads')
      , posts          =  require('../app/controllers/posts')
      , users          =  require('../app/controllers/users')


  // Bubble section parameters
    app.param('bubble_section', function(req, res, next, id) {
      req.bubble_section  =  id

      if       (id == 'event') {
        var timestamp_now            =  (new Date()) / 1000
          , timestamp_six_hours_ago  =  timestamp_now - 21600

        req.query_parameters_find    =  { end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_six_hours_ago} }
        req.query_parameters_sort    =  { start_time: 'asc' }

        req.Post                     =  Event
        req.a_or_an                  =  'an'
      } else if (id == 'talk') {
        req.query_parameters_find    =  { } 
        req.query_parameters_sort    =  { } 

        req.Post                     =  Talk
        req.a_or_an                  =  'a'
      }

      next()
    })


  // User parameters
    app.param('userId', function(req, res, next, id) {
      User
        .findOne({ _id : id })
        .exec(function (err, user) {
          if (err) return next(err)
          if (!user) return next(new Error('Failed to load user ' + id))

          req.user_selected = user
          next()
        })
    })

  // Single post parameters
    app.param('postId', function(req, res, next, id) {
      var Post  =  req.Post
      
      Post
        .findOne({ _id : id })
        .populate('comments')
        .exec(function (err, post) {
          if (err) return next(err)
          if (!post) return next(new Error('Failed to load post ' + id))

          req.object  =  post
          req.post    =  post
        
          var populateComments = function (comment, cb) {
            User
              .findOne({ _id: comment._user })
              .select('name facebook.id')
              .exec(function (err, user) {
                if (err) return next(err)
                comment.user = user
                cb(null, comment)
              })
          }
        
          if (post.comments.length) {
            async.map(req.post.comments, populateComments, function (err, results) {
              next(err)
            })
          }
          else
            next()
        })

    })


  // Bubble parameters
    app.param('bubbleId', function(req, res, next, id) {
      Bubble
        .findOne({ _id : id })
        .exec(function (err, bubble) {
          if (err) return next(err)
          if (!bubble) return next(new Error('Failed to load bubble ' + id))
          req.bubble = bubble
          req.object = bubble
 
          next()
        })
    })


  // Home Route
    app.get('/', auth.requiresLogin, auth.user.render_sidebar, users.home)


  // Upload Routes
    app.post('/uploads/:bubble_section/bubble/:bubbleId', auth.requiresLogin, auth.bubble.hasAuthorization, uploads.upload)
    app.post('/uploads/:bubble_section/event/:postId', auth.requiresLogin, auth.post.hasAuthorization, uploads.upload)


  // Post Routes
    app.get('/bubbles/:bubbleId/:bubble_section/edit/:postId', auth.requiresLogin, auth.post.hasAuthorization, auth.bubble.detect_authorization, posts.edit)
    app.post('/bubbles/:bubbleId/:bubble_section/create', auth.requiresLogin, auth.bubble.hasAuthorization, posts.create, notifications.create, bubbles.count_connections)
    app.get('/bubbles/:bubbleId/:bubble_section/view/:postId', auth.requiresLogin, auth.bubble.detect_authorization, posts.show)
    app.del('/bubbles/:bubbleId/:bubble_section/delete/:postId', auth.requiresLogin, auth.post.hasAuthorization, posts.delete)
    app.post('/bubbles/:bubbleId/:bubble_section/save/:postId', auth.requiresLogin, auth.post.hasAuthorization, posts.save)
    app.get('/bubbles/:bubbleId/:bubble_section', auth.requiresLogin, auth.bubble.detect_authorization, posts.list)
    app.get('/bubbles/:bubbleId/:bubble_section/list_pagelet/:skip', auth.requiresLogin, posts.list_pagelet)
    app.get('/bubbles/:bubbleId', auth.requiresLogin, auth.bubble.detect_authorization, posts.dashboard)
    app.post('/bubbles/:bubbleId/:bubble_section/comment/:postId', auth.requiresLogin, comments.create)


  // Bubble Routes
    app.get('/edit/bubbles/:bubbleId', auth.requiresLogin, auth.bubble.hasAuthorization, auth.bubble.edit_bubble, auth.bubble.detect_authorization, bubbles.edit)
    app.post('/bubbles/:bubbleId/remove_applicant/:userId', auth.requiresLogin, bubbles.remove_applicant, bubbles.count_connections)
    app.post('/bubbles/:bubbleId/add_applicant/:userId', auth.requiresLogin, bubbles.add_applicant, bubbles.remove_fan, bubbles.count_connections)
    app.post('/bubbles/:bubbleId/remove_fan/:userId', auth.requiresLogin, bubbles.remove_fan, bubbles.count_connections)
    app.post('/bubbles/:bubbleId/add_fan/:userId', auth.requiresLogin, bubbles.add_fan, bubbles.count_connections)
    app.post('/edit/bubbles/:bubbleId/update', auth.requiresLogin, auth.bubble.hasAuthorization, bubbles.update)
    app.post('/bubbles', auth.requiresLogin, bubbles.create, bubbles.add_admin, bubbles.count_connections)
    app.del('/bubbles/:bubbleId', auth.requiresLogin, auth.bubble.hasAuthorization, bubbles.delete)


  // User Routes
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
    app.get('/users/:userId', auth.requiresLogin, auth.user.render_sidebar, users.home)
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me' ], failureRedirect: '/login' }), users.signin)
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
    app.get('/users/:userId/new_bubble', auth.requiresLogin, auth.user.render_sidebar, users.new_bubble)


  // Notification Routes
    app.get('/notifications/list_pagelet/:skip', auth.requiresLogin, notifications.list_pagelet)
    app.get('/notifications', auth.requiresLogin, notifications.reset_unviewed, auth.user.render_sidebar, notifications.list)
}
