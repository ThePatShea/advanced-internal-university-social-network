
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
  , crypto = require('crypto')
  , querystring = require('querystring');

mongoose.connect('mongodb://localhost:27017/test');

var userSchema = mongoose.Schema({
  username: String,
  email: String
});


var User = mongoose.model('User',userSchema);


User.find({},
  function(err, users){
    if(err) console.log(err);
    if(users.length == 0){
      var newuser = User({username: 'pxferna', email: 'fernandes.praphat@gmail.com'});
      newuser.save();
    }
  });


passport.use(new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
    issuer: 'passport-saml'
  },

  function(profile, done) {
    User.findOne({'username': profile.uid}, function(err, user){
      console.log(user);
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
    var seed = crypto.randomBytes(20);
    var secret = crypto.createHash('sha1').update(seed).digest('hex');
    // Build the post string from an object
    //secret = '121212121212121212121212'
    var post_data = querystring.stringify({
      'username': req.user.username,
      'secret':secret
    });

    var options = {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/usersecret',
      method: 'PUT',
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
    res.redirect('http://127.0.0.1:8000/user/' + req.user.username + '/' + secret);
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
