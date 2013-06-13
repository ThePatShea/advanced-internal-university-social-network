Meteor.startup(function () {
  var require = Npm.require;
  passport = require('passport');
  var SamlStrategy = require('passport-saml').Strategy;

  passport.use(new SamlStrategy(
    {
      path: '/login/callback',
      entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
      issuer: 'passport-saml'
    },
    function(profile, done) {
      findByEmail(profile.email, function(err, user) {
        if (err) {
          return done(err);
        }
        return done(null, user);
      });
    }
  ));

  Meteor.Router.add('/login/callback', 'POST', function(req, res){
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true });
    res.redirect('/');
  });

  Meteor.Router.add('/login', 'POST', function(req, res){
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true });
    res.redirect('/');
  });

});