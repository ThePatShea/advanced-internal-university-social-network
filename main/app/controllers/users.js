var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Bubble = mongoose.model('Bubble')

exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

// login
exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login'
  })
}

// sign up
exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up'
  })
}

// logout
exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

// session
exports.session = function (req, res) {
  res.redirect('/')
}

// signup
exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) return res.render('users/signup', { errors: err.errors })
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

// show profile
exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
      sidebar_name: user.name
    , title: user.name
    , user: user
  })
}


// show subscriptions
exports.home = function(req, res){
  User
    .findOne({_id: req.user._id})
    .populate('subscriptions._id', 'name num_subscriptions pic_big') 
    .exec(function(err, user) {
      if (err) return res.render('500')

      Bubble
        .find({ subscriptions: { $ne: user._id } },"name num_subscriptions pic_big")
        .exec(function(err, bubbles) {
          if (err) return res.render('500')
             
            res.render('users/home', {
                rendered_sidebar: req.rendered_sidebar
              , unsubscribed: bubbles
              , user: req.user
              , title: 'home'
            })
        })
    })
}


// New bubble
exports.new_bubble = function(req, res){

  // Gets the year for the payment form
    var current_year = new Date().getFullYear();

  User
    .findOne({_id: req.user._id}, "name facebook")
    .exec(function(err, user) {
      if (err) return res.render('500')

        res.render('users/new_bubble', {
            rendered_sidebar: req.rendered_sidebar
          , new_bubble: new Bubble({})
          , current_year: current_year
          , title: 'Create a Bubble'
          , user: user
        })
    })
}
