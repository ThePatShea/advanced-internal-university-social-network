
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
  , mongoose = require('mongoose')
  , querystring = require('querystring');

mongoose.connect('mongodb://localhost/test');

var userSchema = mongoose.Schema({
  email: String
})

var User = mongoose.model('User',userSchema);

passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
    issuer: 'passport-saml'
  },
  function(profile, done) {
    User.findOne({email:profile.email}).exec(function (err, user) {
      if (user == null){
        user = new User({email:profile.email});
        user.save();
      }
      return done(null,user);
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


app.get('/fail', function(req, res){
  res.render('fail');
});

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    res.redirect('/home');
  }
);

app.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    

    // Build the post string from an object
    var post_data = querystring.stringify({
      'secret':'123123123'
    });

    var options = {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/user/' + req.user.email,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': post_data.length
      }
    };
    // Set up the request
    var post_req = http.request(options, function(res) {
      res.setEncoding('utf8');

      // res.redirect(res.headers.location);
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
  }
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
