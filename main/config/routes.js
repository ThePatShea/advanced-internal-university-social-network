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
      , sidebar        =  require('../app/controllers/sidebar')
      , bubbles        =  require('../app/controllers/bubbles')
      , uploads        =  require('../app/controllers/uploads')
      , search         =  require('../app/controllers/search')
      , posts          =  require('../app/controllers/posts')
      , users          =  require('../app/controllers/users')


  // Bubble section parameters
    app.param('bubble_section', function(req, res, next, id) {
      req.bubble_section  =  id

        var timestamp_now            =  (new Date()) / 1000
          , timestamp_six_hours_ago  =  timestamp_now - 21600

             if (id == 'event') {
        req.query_parameters_find    =  { end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_six_hours_ago} }
        req.query_parameters_sort    =  { start_time: 'asc' }

        req.Post                     =  Event
        req.a_or_an                  =  'an'
      } else if (id == 'talk') {
        req.query_parameters_find    =  { } 
        req.query_parameters_sort    =  { createdAt: 'desc' } 

        req.Post                     =  Talk
        req.a_or_an                  =  'a'
      } else if (id == 'dashboard') { 
        req.query_parameters_find    =  { end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_six_hours_ago} } 
        req.query_parameters_sort    =  { createdAt: 'desc' } 

        req.Event                    =  Event
        req.Talk                     =  Talk
      } else if (id == 'notifications') { 
        req.query_parameters_find    =  { 'connections.users.notified': req.user._id } 
        req.query_parameters_sort    =  { createdAt: 'desc' } 

        req.Event                    =  Event
        req.Talk                     =  Talk
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
        .populate('creator')
        .exec(function (err, post) {
          if (err) return next(err)
          if (!post) return next( )

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
        .populate('connections.users.applicants')
        .populate('connections.users.invitees')
        .populate('connections.users.members')
        .populate('connections.users.admins')
        .exec(function (err, bubble) {
          if (err) return next(err)
          if (!bubble) return next(new Error('Failed to load bubble ' + id))
          req.bubble = bubble
          req.object = bubble
 
          next()
        })
    })

  // User parameters
    app.param('query', function(req, res, next, id) {
      req.query = id
      next()
    })

  // Post Routes
    // Get Requests
      app.get('/bubbles/:bubbleId/:bubble_section/view/:postId'        ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  auth.post.get_connect_status  ,  auth.post.redirect_member_if_private          ,  sidebar.bubble  ,  posts.single)
      app.get('/bubbles/:bubbleId/:bubble_section/edit/:postId'        ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  auth.post.get_connect_status  ,  auth.post.redirect_creator_or_admin  ,  sidebar.bubble  ,  posts.edit)
      app.get('/bubbles/:bubbleId'                                     ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  sidebar.bubble                ,  posts.dashboard)
      app.get('/bubbles/:bubbleId/:bubble_section'                     ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  sidebar.bubble                ,  posts.list)
      app.get('/bubbles/:bubbleId/:bubble_section/list_pagelet/:skip'  ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  posts.list_pagelet)

    // Post Requests
      app.del('/bubbles/:bubbleId/:bubble_section/delete/:postId'      ,  auth.requiresLogin  ,  auth.post.get_connect_status    ,  auth.post.redirect_creator_or_admin  ,  posts.delete  ,  notifications.delete  ,  bubbles.count_connections)
      app.post('/bubbles/:bubbleId/:bubble_section/create'             ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  auth.bubble.redirect_member  ,  posts.create  ,  notifications.create  ,  bubbles.count_connections)
      app.post('/bubbles/:bubbleId/:bubble_section/save/:postId'       ,  auth.requiresLogin  ,  auth.post.get_connect_status    ,  auth.post.redirect_creator_or_admin  ,  posts.save)
      app.post('/bubbles/:bubbleId/:bubble_section/comment/:postId'    ,  auth.requiresLogin  ,  comments.create)


  // Bubble Routes
    // Get Requests
      // Edit Bubble
        app.get('/edit/bubbles/:bubbleId'                       ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  auth.bubble.redirect_admin  ,  sidebar.bubble  ,  bubbles.edit)

    // Post Requests
      // Add User Connection
        app.post('/bubbles/:bubbleId/add_member/:userId'        ,  auth.requiresLogin  ,  bubbles.add_member              ,  bubbles.remove_fan          ,  bubbles.remove_applicant  ,  bubbles.remove_invitee  ,  bubbles.count_connections)
        app.post('/bubbles/:bubbleId/add_applicant/:userId'     ,  auth.requiresLogin  ,  bubbles.add_applicant           ,  bubbles.remove_fan          ,  bubbles.count_connections)
        app.post('/bubbles/:bubbleId/add_invitee/:userId'       ,  auth.requiresLogin  ,  bubbles.add_invitee             ,  bubbles.remove_fan          ,  bubbles.count_connections)
        app.post('/bubbles/:bubbleId/add_admin/:userId'         ,  auth.requiresLogin  ,  bubbles.add_admin               ,  bubbles.remove_member       ,  bubbles.count_connections)
        app.post('/bubbles/:bubbleId/add_fan/:userId'           ,  auth.requiresLogin  ,  bubbles.add_fan                 ,                                 bubbles.count_connections)

      // Remove User Connection
        app.post('/bubbles/:bubbleId/remove_applicant/:userId'  ,  auth.requiresLogin  ,  bubbles.remove_applicant        ,                                 bubbles.count_connections)
        app.post('/bubbles/:bubbleId/remove_invitee/:userId'    ,  auth.requiresLogin  ,  bubbles.remove_invitee          ,                                 bubbles.count_connections)
        app.post('/bubbles/:bubbleId/remove_member/:userId'     ,  auth.requiresLogin  ,  bubbles.remove_member           ,                                 bubbles.count_connections)
        app.post('/bubbles/:bubbleId/remove_admin/:userId'      ,  auth.requiresLogin  ,  bubbles.remove_admin            ,                                 bubbles.count_connections)
        app.post('/bubbles/:bubbleId/remove_fan/:userId'        ,  auth.requiresLogin  ,  bubbles.remove_fan              ,                                 bubbles.count_connections)

      // Other
        app.post('/bubbles/:bubbleId/demote_to_member/:userId'  ,  auth.requiresLogin  ,  bubbles.remove_admin            ,  bubbles.add_member          ,  bubbles.count_connections)
        app.post('/bubbles'                                     ,  auth.requiresLogin  ,  bubbles.create                  ,  bubbles.add_admin           ,  bubbles.count_connections)
        app.post('/edit/bubbles/:bubbleId/update'               ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  auth.bubble.redirect_admin  ,  bubbles.update)
        app.del('/bubbles/:bubbleId'                            ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  auth.bubble.redirect_admin  ,  bubbles.delete)


  // User Routes
    app.get('/auth/facebook'             ,  passport.authenticate('facebook', { scope: [ 'email', 'user_about_me' ]  ,  failureRedirect: '/login' })  ,  users.signin)
    app.get('/auth/facebook/callback'    ,  passport.authenticate('facebook', { failureRedirect: '/login' })         ,  users.authCallback)
    app.post('/users/session'            ,  passport.authenticate('local', {failureRedirect: '/login'})              ,  users.session)
    app.post('/browse_bubbles'           ,  auth.requiresLogin  ,  sidebar.user  ,  users.submit_search)
    app.get('/browse_bubbles/:query'     ,  auth.requiresLogin  ,  sidebar.user  ,  users.browse_bubbles)
    app.get('/browse_bubbles'            ,  auth.requiresLogin  ,  sidebar.user  ,  users.browse_bubbles)
    app.get('/users/:userId/new_bubble'  ,  auth.requiresLogin  ,  sidebar.user  ,  users.new_bubble)
    app.get('/users/:userId'             ,  auth.requiresLogin  ,  sidebar.user  ,  users.home)
    app.get('/'                          ,  auth.requiresLogin  ,  sidebar.user  ,  users.home)
    app.get('/:bubble_section/list_pagelet/:skip'  ,  auth.requiresLogin  ,  posts.list_pagelet)
    app.get('/signup'                    ,  users.signup)
    app.get('/logout'                    ,  users.logout)
    app.post('/users'                    ,  users.create)
    app.get('/login'                     ,  users.login)
    app.get('/beta'                      ,  res.redirect('/') )


  // Upload Routes
    app.post('/uploads/bubbles/:bubbleId/:bubble_section/event/:postId'     ,  auth.requiresLogin  ,  auth.post.get_connect_status    ,  auth.post.redirect_creator_or_admin  ,  uploads.upload)
    app.post('/uploads/bubbles/:bubbleId/:bubble_section/bubble/:bubbleId'  ,  auth.requiresLogin  ,  auth.bubble.get_connect_status  ,  auth.bubble.redirect_admin           ,  uploads.upload)


  // Notification Routes
    app.get('/notifications'                     ,  auth.requiresLogin  ,  notifications.reset_unviewed  ,  sidebar.user  ,  notifications.list)
    // app.get('/notifications/list_pagelet/:skip'  ,  auth.requiresLogin  ,  notifications.list_pagelet)


  // Search Routes
    app.get('/search/bubbles/:bubbleId/users'  ,  search.users)
}
