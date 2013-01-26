var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , Bubble = mongoose.model('Bubble')
  , Event = mongoose.model('Event')
  , User = mongoose.model('User')
  , Deal = mongoose.model('Deal')
  , Talk = mongoose.model('Talk')
  , async = require('async')


module.exports = function (app, passport, auth) {
  // User routes
    var users = require('../app/controllers/users')
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
    app.get('/users/:userId', auth.requiresLogin, users.show)
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
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


  // Deal routes
    var deals = require('../app/controllers/deals')
    app.get('/bubbles/:bubbleId/deals', auth.requiresLogin, deals.list)
    app.get('/bubbles/:bubbleId/deals/:dealId', auth.requiresLogin, deals.show)
    app.post('/bubbles/:bubbleId/create_deal', auth.requiresLogin, deals.create)
  
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
  

  // Talk routes
  var talks = require('../app/controllers/talks')
  app.get('/bubbles/:bubbleId/talks', auth.requiresLogin, talks.list)
  app.get('/bubbles/:bubbleId/talks/:talkId', auth.requiresLogin, talks.show)
  app.post('/bubbles/:bubbleId/create_talk', auth.requiresLogin, talks.create)

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


  // event routes
  var events = require('../app/controllers/events')
  app.get('/bubbles/:bubbleId/events/:eventId', auth.requiresLogin, events.show)
  app.post('/bubbles/:bubbleId/create_event', auth.requiresLogin, events.create)


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

  // Bubble routes
    var bubbles = require('../app/controllers/bubbles')
    app.post('/bubbles', auth.requiresLogin, bubbles.create)
    app.get('/bubbles/:bubbleId', auth.requiresLogin, events.list)
    app.get('/bubbles/:bubbleId/events', auth.requiresLogin, events.list)
    app.get('/bubbles/:bubbleId/edit', auth.requiresLogin, bubbles.edit)

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

  // Home route
    app.get('/', auth.requiresLogin, users.subscriptions)

  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create)
  app.post('/bubbles/:bubbleId/events/:eventId/comments', auth.requiresLogin, comments.create)
  app.post('/bubbles/:bubbleId/deals/:dealId/comments', auth.requiresLogin, comments.create)
  app.post('/bubbles/:bubbleId/talks/:talkId/comments', auth.requiresLogin, comments.create)

  // Subscription routes
    app.post('/bubbles/:bubbleId/unsubscribe', auth.requiresLogin, bubbles.unsubscribe)
    app.post('/bubbles/:bubbleId/subscribe', auth.requiresLogin, bubbles.subscribe)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', auth.requiresLogin, tags.index)

  // payment routes
  var stripeApiKey = "sk_live_MEyrnnycBVAD6cL56HqElb7M";
  var stripeApiKeyTesting = "sk_test_BChwgXIdtRK3VbAOU3n4HYLo";
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


  // article routes
  var articles = require('../app/controllers/articles')
  app.get('/articles', auth.requiresLogin, articles.index)
  app.get('/articles/new', auth.requiresLogin, articles.new)
  app.post('/articles', auth.requiresLogin, articles.create)
  app.get('/articles/:id', auth.requiresLogin, articles.show)
  app.get('/articles/:id/edit', auth.requiresLogin, auth.article.hasAuthorization, articles.edit)
  app.put('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.update)
  app.del('/articles/:id', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy)

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

}
