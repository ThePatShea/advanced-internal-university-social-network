// Include the models
  var mongoose  =  require('mongoose')
    , Article   =  mongoose.model('Article')
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


  // Home Route
    app.get('/', auth.requiresLogin, users.subscriptions)


  // Upload Routes
    app.post('/bubbles/:bubbleId/events/:eventId/upload', auth.requiresLogin, events.upload)
    app.post('/bubbles/:bubbleId/deals/:dealId/upload', auth.requiresLogin, deals.upload)


  // Bubble Routes
    app.post('/bubbles/:bubbleId/update', auth.requiresLogin, bubbles.update)
    app.get('/bubbles/:bubbleId/edit', auth.requiresLogin, bubbles.edit)
    app.get('/bubbles/:bubbleId', auth.requiresLogin, posts.redirect)
    app.post('/bubbles', auth.requiresLogin, bubbles.create)

    app.param('bubbleId', function(req, res, next, id) {
      Bubble
        .findOne({ _id : id })
        .exec(function (err, bubble) {
          if (err) return next(err)
          if (!bubble) return next(new Error('Failed to load bubble ' + id))
          req.bubble = bubble
  
          if (req.user.subscriptions.indexOf(req.bubble._id) >= 0) {
            var user_subscribed = 1
          } else {
            var user_subscribed = 0
          }
 
          res.render('includes/sidebar_top_bubble', {
              bubble: bubble
            , user_subscribed: user_subscribed
          },function(err, sidebar_top) {
            req.sidebar_top = sidebar_top
            res.render('includes/sidebar_buttons_bubble', { bubble: bubble }, function(err, sidebar_buttons) {
              req.sidebar_buttons = sidebar_buttons
              next()
            })
          })
        })
    })


  // Event Routes
    app.get('/bubbles/:bubbleId/events_list_pagelet/:skip', auth.requiresLogin, events.list_pagelet)
    app.post('/bubbles/:bubbleId/events/:eventId/update', auth.requiresLogin, events.update)
    app.get('/bubbles/:bubbleId/events/:eventId/edit', auth.requiresLogin, events.edit)
    app.post('/bubbles/:bubbleId/create_event', auth.requiresLogin, events.create)
    app.get('/bubbles/:bubbleId/events/:eventId', auth.requiresLogin, events.show)
    app.get('/bubbles/:bubbleId/events', auth.requiresLogin, events.list)

    app.param('eventId', function(req, res, next, id) {
      Event
        .findOne({ _id : req.params.eventId })
        .populate('comments')
        .exec(function (err, event) {
          if (err) return next(err)
          if (!event) return next(new Error('Failed to load event ' + id))
          req.event = event
      
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
      
          if (event.comments.length) {
            async.map(req.event.comments, populateComments, function (err, results) {
              next(err)
            })
          }
          else
            next()
        })
    })


  // Deal Routes
    app.get('/bubbles/:bubbleId/deals_list_pagelet/:skip', auth.requiresLogin, deals.list_pagelet)
    app.post('/bubbles/:bubbleId/create_deal', auth.requiresLogin, deals.create)
    app.get('/bubbles/:bubbleId/deals/:dealId', auth.requiresLogin, deals.show)
    app.get('/bubbles/:bubbleId/deals', auth.requiresLogin, deals.list)
  
    app.param('dealId', function(req, res, next, id) {
      Deal
        .findOne({ _id : req.params.dealId })
        .populate('comments')
        .exec(function (err, deal) {
          if (err) return next(err)
          if (!deal) return next(new Error('Failed to load deal ' + id))
          req.deal = deal
  
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
  
          if (deal.comments.length) {
            async.map(req.deal.comments, populateComments, function (err, results) {
              next(err)
            })
          }
          else {
            next()
          }
        })
    })


  // Talk Routes
    app.get('/bubbles/:bubbleId/talks_list_pagelet/:skip', auth.requiresLogin, talks.list_pagelet)
    app.post('/bubbles/:bubbleId/create_talk', auth.requiresLogin, talks.create)
    app.get('/bubbles/:bubbleId/talks/:talkId', auth.requiresLogin, talks.show)
    app.get('/bubbles/:bubbleId/talks', auth.requiresLogin, talks.list)
  
    app.param('talkId', function(req, res, next, id) {
      Talk
        .findOne({ _id : req.params.talkId })
        .populate('comments')
        .exec(function (err, talk) {
          if (err) return next(err)
          if (!talk) return next(new Error('Failed to load talk ' + id))
          req.talk = talk
  
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
  
          if (talk.comments.length) {
            async.map(req.talk.comments, populateComments, function (err, results) {
              next(err)
            })
          }
          else {
            next()
          }
        })
    })


  // User Routes
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
    app.get('/users/:userId', auth.requiresLogin, users.subscriptions)
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me', 'user_education_history', 'friends_education_history', 'user_events', 'friends_events', 'user_likes', 'friends_likes'], failureRedirect: '/login' }), users.signin)
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
    app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)
    app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)
    app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin)
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)
    app.get('/users/:userId/new_bubble', auth.requiresLogin, users.new_bubble)

    app.param('userId', function (req, res, next, id) {
      User
        .findOne({ _id : id })
        .exec(function (err, user) {
          if (err) return next(err)
          if (!user) return next(new Error('Failed to load User ' + id))
          req.profile = user
          next()
        })
    })


  // Comment Routes
    app.post('/bubbles/:bubbleId/events/:eventId/comments', auth.requiresLogin, comments.create)
    app.post('/bubbles/:bubbleId/deals/:dealId/comments', auth.requiresLogin, comments.create)
    app.post('/bubbles/:bubbleId/talks/:talkId/comments', auth.requiresLogin, comments.create)
    app.post('/articles/:id/comments', auth.requiresLogin, comments.create)


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


  // Unused Boilerplate Routes
    // Unused Controllers
      var articles = require('../app/controllers/articles')
      var tags = require('../app/controllers/tags')


    // Article Routes
      app.get('/articles/:id/edit', auth.requiresLogin, auth.article.hasAuthorization, articles.edit)
      app.del('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy)
      app.put('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.update)
      app.get('/articles/:id', auth.requiresLogin, articles.show)
      app.post('/articles', auth.requiresLogin, articles.create)
      app.get('/articles/new', auth.requiresLogin, articles.new)
      app.get('/articles', auth.requiresLogin, articles.index)
    
      app.param('id', function(req, res, next, id) {
        Article
          .findOne({ _id : id })
          .populate('user', 'name')
          .populate('comments')
          .exec(function (err, article) {
            if (err) return next(err)
            if (!article) return next(new Error('Failed to load article ' + id))
            req.article = article
    
            var populateComments = function (comment, cb) {
              User
                .findOne({ _id: comment._user })
                .select('name')
                .exec(function (err, user) {
                  if (err) return next(err)
                  comment.user = user
                  cb(null, comment)
                })
            }
    
            if (article.comments.length) {
              async.map(req.article.comments, populateComments, function (err, results) {
                next(err)
              })
            }
            else
              next()
          })
      })
  
  
    // Tag Routes
      app.get('/tags/:tag', auth.requiresLogin, tags.index)
}
