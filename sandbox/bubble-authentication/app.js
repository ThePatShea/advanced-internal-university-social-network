
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , SamlStrategy = require('passport-saml').Strategy
  , mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var User = mongoose.model('User',{email:String})

findByEmail = function(email) {
  return User.findOne({email:email});
}


passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
    issuer: 'passport-saml'
  },
  function(profile, done) {
    console.log(profile);
    findByEmail(profile.email, function(err, user) {
      if (err) {
        return done(err);
      }


      if (!user){
        user = User.insert({email:profile.email})
      }

      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(passport.initialize());
app.use(passport.session());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/trylogin', 
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.render('home');
  });

/*app.post('/login', function(req,res){
  res.send(req.body);
});*/

app.get('/fail', function(req, res){
  res.render('fail');
});

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

app.post('/login/callback',
  passport.authenticate('saml', { successRedirect:'localhost:3000/home', failureRedirect: '/', failureFlash: true })
);

app.get('/home', function(req, res){
  res.render('home');
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
