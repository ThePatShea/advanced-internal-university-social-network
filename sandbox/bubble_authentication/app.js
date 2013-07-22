

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy
  , SamlStrategy = require('passport-saml').Strategy
  , mongoose = require('mongoose'), crypto = require('crypto')
  , fs = require('fs'), querystring = require('querystring');

mongoose.connect('mongodb://localhost:27017/test');

var globalprofile = '';
//var date = new Date();


//var privateKey = fs.readFileSync('./certs/ssl-key.pem').toString();
//var certificate = fs.readFileSync('./certs/ssl-cert.pem').toString();
var privateKey = fs.readFileSync('./certs/talkschool.net.key').toString();
var certificate = fs.readFileSync('./certs/talkschool.net.crt').toString();


var userSchema = mongoose.Schema({
  username: String,
  email: String
})

var User = mongoose.model('User',userSchema);

var samlStrategy = new SamlStrategy(
  {
    // Wether we'll be talking to shibboleth
    'isShibboleth': true,

    // The URL where the IdP should redirect the user to.
    'callbackUrl': 'https://54.243.243.128/login/samlcallback',

    // The URL where we should redirect the user to.
    //'entryPoint': 'https://idp.testshib.org/idp/profile/SAML2/Redirect/SSO',
    'entryPoint': 'https://idp.guest.vm.org/idp/profile/SAML2/Redirect/SSO',

    // The entityID that we used to register our SP
    //'issuer': 'http://54.243.243.128:8000/shibboleth',
    //'issuer': 'emorybubble',
    'issuer': 'https://54.243.243.128/shibboleth',

    // The public certificate of the TestShib IdP
    // Find the full one at https://www.testshib.org/metadata/testshib-providers.xml
    //'cert': 'MIIEDjCCAvagAwIBAgIBADANBgkqhkiG9w0BAQUFADBnMQswCQYDVQQ...nl+ev0peYzxFyF5sQA==',

    // The path to the parser jar.
    // The parser will be used to decrypt anything that the IdP sends us.
    // See https://github.com/sakaiproject/SAMLParser
    //'converter': '/path/to/the/parser.jar',

    // Your public certificate
    'publicCert': 'MIIC5zCCAc+gAwIBAgIJALP9fTjOSsDbMA0GCSqGSIb3DQEBBQUAMBkxFzAVBgNVBAMTDjU0LjI0My4yNDMuMTI4MB4XDTEzMDYyODIxNDQyNFoXDTIzMDYyNjIxNDQyNFowGTEXMBUGA1UEAxMONTQuMjQzLjI0My4xMjgwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCqxcllziQTqmDoaTG/9gTsyqZ8auGosZROUl9+PxgafFM615sUGbL2EY23/9Ja5nma9PCWZk3Vd/nqt6AQhyMQXaiLVpAeoAZ0iMgzfac9b/pYIbiCsoyXiCIZTHN0o99iP5Bkmgj4q1tfOSechzgfv00fgzX35CnJaytvGuQIMBgGg0PJMTxT3RevoN8SDP2bxr17SQzUOBoOLg9DCt/njsbc4LWTISK3tc+WD/nvT6Q89D6rcs8hA+b8z5OGZthSySu66JQNiXGWjtZg9kWji9mVLG0KXBnKXLWzWm12UiH9BsleBwj0WOJSTc4vOQ2I7ioUDdXSqGMxwuQC55FHAgMBAAGjMjAwMA8GA1UdEQQIMAaHBDbz84AwHQYDVR0OBBYEFGLeXgFgauX3EuFnkcyjqDIt1wivMA0GCSqGSIb3DQEBBQUAA4IBAQAV8dQ0WUrif65pQH1Eec91K23bGRkcmX/s1Oom71u7PkIH3Jl4ep12DR1vm0pHIG0EAs7yRfdtF9Y9W/pQYGJLJcjPbz6Zp8JUy529EsPYDxRzYqShzGLtHhB6hxA/NzqX00IdFeu/d/h2JHfb4tpeWHwOKRYOfzuqsEp0pjjdVutw8Rx4OxCtAygXqYprT8V33jrl6/G0DZkoGZ49Skwk+sKnAaukA3YB+MrTFxkpxLqFliEKj14sg3oqZkC0RWBqMBc6E+ljH7jwmHlXyYkGuL50PtWZbGv0wMrsmVedNisdCmnJPi66EKQSb7sKdUM1Z3km2Dc/fjG1Vhia64AH',

    // The subject name you used in your certificate (CN)
    'publicCertSubjectName': '54.243.243.128',

    // Your private certificate
    'privateCert': 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqxcllziQTqmDoaTG/9gTsyqZ8auGosZROUl9+PxgafFM615sUGbL2EY23/9Ja5nma9PCWZk3Vd/nqt6AQhyMQXaiLVpAeoAZ0iMgzfac9b/pYIbiCsoyXiCIZTHN0o99iP5Bkmgj4q1tfOSechzgfv00fgzX35CnJaytvGuQIMBgGg0PJMTxT3RevoN8SDP2bxr17SQzUOBoOLg9DCt/njsbc4LWTISK3tc+WD/nvT6Q89D6rcs8hA+b8z5OGZthSySu66JQNiXGWjtZg9kWji9mVLG0KXBnKXLWzWm12UiH9BsleBwj0WOJSTc4vOQ2I7ioUDdXSqGMxwuQC55FHAgMBAAECggEAUF5zEQl56xNlNhvDwR7MZJBe1/EJMHYaYN3deTHCazyVgvzTTBtoIOxT8QNhgUw0cNvTmkSdXthu8qrmlsCynNInLyRXAUK4pwF0jt8U5RIdFHsSNdhH2EzGF3fmYj95MujNULs5e6ZRgzgHz1/H5xEF/82liXuEuvlH4KscJEmQm5PyBEtOoe+HKugGPuQOzOvIxM7PJBltcH+YztuObaAr3hJtXf65R5K5Bud2yA2TVXyUWayXqWKGHEJ1SYsUrrdObgHf9Oq3/n9Dmx9x8Hz+b+tm9VZ4mqmJkz2pNl4N8byh7kPvRTEcBYD2WSC+Et8hzUlk5qtsqV7Oqf3WsQKBgQDjD8+llKvofj4yJbhk/JI873pvEUHB5fhL8yiVs8yjQBW6TFJ+PS/f47e53LQfSrn2gCrMFOoo/PvJp3sNxiOB9+D8sGL8A7IG7AVSHZose1f1r+Z/ezq4lG8W9iCpx7m5DkGiYzmGQUL/uiE/QPXwgi9KEFFS7sWoffQYscBqeQKBgQDAiXe8cuB0c6t8rg/PT17EaqOxPRICMHiU5MFJdwl4h5Qx0mGVNvL39W8As/fMiWg9noJEbdbACYlG0atUJC01FwmB6B2LTK0z/dn3+tujGNK62BGr6m+s0K6x7ks7eiURsSuYSQQHiqcNV9kxfuhCQWi0xIEsHLJ4QwOKgvDpvwKBgQCbKB+9RuVdnn6Dp/Dj2Q9Y4k/oe4NSqwHLbGIsQcuxNkZiomqwZsFDHYlbUSwoQdjnT1dvU09bKNwpRO+6Ts3OrwKnySQqj5/kSP2tyhqjELnfYg6AyEUtAgkTSKazPY50nQBOpb0WN5w/wQGdBpfIfD0yQApCQHUCmObmxPf2CQKBgCWo/e2zfqnokiuCFH+VY9EBluEtM9+PwZZGJHSNPyH/SwJvxzybkezkagD2MsskOWqMHajq3y2S7/IVQvDjXqBa0DZDw7uilOJtjfwOanW9fkKjztkUsyFXdERDex24J5YNVJyl847SFRjsDQS8cQu8pZFuOmH5fwM9AG1QbXUbAoGBAK1+o7hiu3/wnwmfKQxN0ace2y8sR7RkYH93OYzXmNEXpR/gsTcE3pQrKtYaEvo92JwDF+gL7lB7cV2Qx8ZbQ90E2d1STLVkqa3Zb/qo9/w2c+ytm7iHSkUY7PHyl/CNE3UEgIl6FD8kRbjPTGKRgKtExdC1Mzpi9RVq+uLgBM5n',
    'identifierFormat': null

    // It would not be un-wise to pass in an implementation of the AntiReplayStore if you're
    // running in a cluster as you might be vulnerable to replay attacks otherwise.
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
);

passport.use(samlStrategy);


//The old stuff that worked with Feide OpenIDP
/*passport.use(new SamlStrategy(
  //The old Feide OpenIDP Saml Strategy
  {
    path: '/login/samlcallback',
    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
    //entryPoint: 'https://idp.guest.vm.org/idp/profile/SAML2/Redirect/SSO',
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
));*/

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//var app = express();
var options = {key: privateKey, cert: certificate};
var app = express();


// all environments
app.set('port', process.env.PORT || 80);
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

app.get('/shibboleth/metadata', function(req, res) {
    res.send(200, samlStrategy.getShibbolethMetadata());
});    

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


app.get('/testlogin', function(req, res){
  res.render('login');
});

app.post('/testlogin', function(req, res){
  console.log(req.body.username, req.body.password);
  var seed = crypto.randomBytes(20);
  var secret = crypto.createHash('sha1').update(seed).digest('hex');

  var data = querystring.stringify({
      username: req.body.username,
      password: req.body.password,
      'secret': secret
    });

  var options = {
    host: 'localhost',
    port: 80,
    path: '/authenticateduser',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
    }
  };

  var req = http.request(options, function(response) {
    console.log('Post sent');
    res.header('location', 'authenticateduser/' + secret);
    res.send(302, null);
  });

  req.write(data);
  req.end();

});


app.get('/authenticateduser/:id', function(req, res){
  console.log('User redirect secret: ', req.params.id);
  res.send(req.headers);
});

app.post('/authenticateduser', function(req, res){
  console.log('Post: ', req.body.username, req.body.password, req.body.secret);
  res.send('Secret received');
});


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

//app.get('/', routes.index);

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

https.createServer(options, app).listen(443);
