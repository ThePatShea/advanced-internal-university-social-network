

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
  , fs = require('fs');

mongoose.connect('mongodb://localhost:27017/test');

var globalprofile = '';
//var date = new Date();

var userSchema = mongoose.Schema({
  username: String,
  email: String
})

var User = mongoose.model('User',userSchema);

passport.use(new SamlStrategy(
  {
    path: '/login/samlcallback',
    //entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
    entryPoint: 'https://idp.guest.vm.org/idp/profile/SAML2/Redirect/SSO',
    issuer: 'emorybubble',
    //cert: 'MIICizCCAfQCCQCY8tKaMc0BMjANBgkqhkiG9w0BAQUFADCBiTELMAkGA1UEBhMCTk8xEjAQBgNVBAgTCVRyb25kaGVpbTEQMA4GA1UEChMHVU5JTkVUVDEOMAwGA1UECxMFRmVpZGUxGTAXBgNVBAMTEG9wZW5pZHAuZmVpZGUubm8xKTAnBgkqhkiG9w0BCQEWGmFuZHJlYXMuc29sYmVyZ0B1bmluZXR0Lm5vMB4XDTA4MDUwODA5MjI0OFoXDTM1MDkyMzA5MjI0OFowgYkxCzAJBgNVBAYTAk5PMRIwEAYDVQQIEwlUcm9uZGhlaW0xEDAOBgNVBAoTB1VOSU5FVFQxDjAMBgNVBAsTBUZlaWRlMRkwFwYDVQQDExBvcGVuaWRwLmZlaWRlLm5vMSkwJwYJKoZIhvcNAQkBFhphbmRyZWFzLnNvbGJlcmdAdW5pbmV0dC5ubzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAt8jLoqI1VTlxAZ2axiDIThWcAOXdu8KkVUWaN/SooO9O0QQ7KRUjSGKN9JK65AFRDXQkWPAu4HlnO4noYlFSLnYyDxI66LCr71x4lgFJjqLeAvB/GqBqFfIZ3YK/NrhnUqFwZu63nLrZjcUZxNaPjOOSRSDaXpv1kb5k3jOiSGECAwEAATANBgkqhkiG9w0BAQUFAAOBgQBQYj4cAafWaYfjBU2zi1ElwStIaJ5nyp/s/8B8SAPK2T79McMyccP3wSW13LHkmM1jwKe3ACFXBvqGQN0IbcH49hu0FKhYFM/GPDJcIHFBsiyMBXChpye9vBaTNEBCtU3KjjyG0hRT2mAQ9h+bkPmOvlEo/aH0xR68Z9hw4PF13w==',
    //privateCert: fs.readFileSync('/home/pxferna/certs/sp-key.pem', 'utf-8')
  },
  function(profile, done) {
    globalprofile = JSON.stringify(profile);
    User.findOne({username: profile.uid}, function (err, user) {
      if (user == null){
        user = new User({username: profile.uid, email:profile.email});
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
app.set('port', process.env.PORT || 8000);
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

app.get('/welcome', function(req, res){
  var date = new Date();
  res.render('welcome', {datetime: JSON.stringify(date)});
});

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/fail', failureFlash: true }),
  function(req, res) {
    res.redirect('/home');
  }
);

app.post('/login/samlcallback',
  passport.authenticate('saml', { failureRedirect: '/fail', failureFlash: true }),
  function(req, res) {
    //res.render('home', {username: req.user.username});
    res.render('home', {username: globalprofile});
  }
);

app.get('/home', function(req, res){
  res.render('home');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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
