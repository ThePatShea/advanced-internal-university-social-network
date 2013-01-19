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
exports.subscriptions = function(req, res){
  User
    .findOne({_id: req.user._id})
    .populate('subscriptions', 'name') 
    .exec(function(err, user) {
      if (err) return res.render('500')

      var subscriptions = user.subscriptions

      console.log(subscriptions[1]._id)

      Bubble
        .find({ subscriptions: { $ne: user._id } },"name")
        .exec(function(err, bubbles) {
          if (err) return res.render('500')


          res.render('users/subscriptions', {
              sidebar_name: user.name
            , title: "subscriptions"
            , subscribed: subscriptions
            , unsubscribed: bubbles
            , user: user
           })
        })

    })
}
