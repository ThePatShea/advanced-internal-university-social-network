// Include the models
  var mongoose  =  require('mongoose')
    , Bubble    =  mongoose.model('Bubble')
    , Event     =  mongoose.model('Event')
    , Deal      =  mongoose.model('Deal')
    , Talk      =  mongoose.model('Talk')
    , User      =  mongoose.model('User')
    , async     =  require('async')


module.exports = function (app, passport, auth) {
  // Include the controllers
    var comments  =  require('../app/controllers/comments')
    var bubbles   =  require('../app/controllers/bubbles')
    var uploads   =  require('../app/controllers/uploads')
    var events    =  require('../app/controllers/events')
    var deals     =  require('../app/controllers/deals')
    var talks     =  require('../app/controllers/talks')
    var posts     =  require('../app/controllers/posts')
    var users     =  require('../app/controllers/users')


  // Bubble section parameters
    app.param('bubble_section', function(req, res, next, id) {
      req.bubble_section  =  id

      if       (id == 'event') {
        var timestamp_now            =  (new Date()) / 1000
        var timestamp_six_hours_ago  =  timestamp_now - 21600

        req.query_parameters_find    =  { end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_six_hours_ago} }
        req.query_parameters_sort    =  { start_time: 'asc' }

        Post                         =  Event
      } else if (id == 'deal') {
        var timestamp_now            =  (new Date()) / 1000
        req.query_parameters_find    =  { } 
        req.query_parameters_sort    =  { } 

        Post                         =  Deal
      } else if (id == 'talk') {
        req.query_parameters_find    =  { } 
        req.query_parameters_sort    =  { } 

        Post                         =  Talk
      }

      req.Post  =  Post
      next()
    })


  // Single post parameters
    app.param('postId', function(req, res, next, id) {
      var Post  =  req.Post
      
      Post
        .findOne({ _id : req.params.postId })
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
 
          next()
        })
    })


  // Home Route
    app.get('/', auth.requiresLogin, auth.user.render_sidebar, users.subscriptions)


  // Upload Routes
    app.post('/bubbles/:bubbleId/:bubble_section/view/:postId/upload', auth.requiresLogin, auth.post.hasAuthorization, uploads.upload)
    app.post('/bubbles/:bubbleId/deals/:dealId/upload', auth.requiresLogin, deals.upload)


  // Post Routes
    app.get('/bubbles/:bubbleId/:bubble_section/view/:postId', auth.requiresLogin, auth.bubble.detect_authorization, posts.show)
    app.get('/bubbles/:bubbleId/:bubble_section/list_pagelet/:skip', auth.requiresLogin, posts.list_pagelet)
    app.post('/bubbles/:bubbleId/:bubble_section/comment/:postId', auth.requiresLogin, comments.create)
    app.get('/bubbles/:bubbleId/:bubble_section', auth.requiresLogin, auth.bubble.detect_authorization, posts.list)


  // Bubble Routes
    app.get('/edit/bubbles/:bubbleId', auth.requiresLogin, auth.bubble.hasAuthorization, auth.bubble.edit_bubble, auth.bubble.detect_authorization, bubbles.edit)
    app.post('/edit/bubbles/:bubbleId/update', auth.requiresLogin, auth.bubble.hasAuthorization, bubbles.update)
    app.get('/bubbles/:bubbleId', auth.requiresLogin, posts.redirect)
    app.post('/bubbles', auth.requiresLogin, bubbles.create)


  // Event Routes
    app.post('/bubbles/:bubbleId/events/:eventId/update', auth.requiresLogin, events.update)
    app.get('/bubbles/:bubbleId/events/:eventId/edit', auth.requiresLogin, events.edit)
    app.post('/bubbles/:bubbleId/create_event', auth.requiresLogin, events.create)


  // Deal Routes
    app.post('/bubbles/:bubbleId/create_deal', auth.requiresLogin, deals.create)
  

  // Talk Routes
    app.post('/bubbles/:bubbleId/create_talk', auth.requiresLogin, talks.create)
  

  // User Routes
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
    app.get('/users/:userId', auth.requiresLogin, auth.user.render_sidebar, users.subscriptions)
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me', 'user_education_history', 'friends_education_history', 'user_events', 'friends_events', 'user_likes', 'friends_likes'], failureRedirect: '/login' }), users.signin)
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
    app.get('/users/:userId/new_bubble', auth.requiresLogin, auth.user.render_sidebar, users.new_bubble)


  // Subscription Routes
    app.post('/bubbles/:bubbleId/unsubscribe', auth.requiresLogin, bubbles.unsubscribe)
    app.post('/bubbles/:bubbleId/subscribe', auth.requiresLogin, bubbles.subscribe)


  // Payment Routes
    var stripeApiKeyTesting = "sk_test_BChwgXIdtRK3VbAOU3n4HYLo";
    var stripeApiKey = "sk_live_MEyrnnycBVAD6cL56HqElb7M";
    var stripe = require('stripe')(stripeApiKeyTesting);
  
    app.post("/pay/company_bubble", function(req, res) {
      stripe.customers.create({
        card : req.body.stripeToken,
        email : req.user.email, // customer's email (get it from db or session)
        plan : "company_bubble"
      }, function (err, customer) {
        if (err) {
          var msg = customer.error.message || "unknown";
          res.send("Error while processing your payment: " + msg);
        }
        else {
          var id = customer.id;
          console.log('Success! Customer with Stripe ID ' + id + ' just signed up!');
          // save this customer to your database here!
          res.send('ok');
        }
      });
    });


}
