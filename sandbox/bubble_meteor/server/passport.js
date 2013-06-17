Meteor.startup(function () {
  var require = Npm.require;

  passport = require('passport');
  var SamlStrategy = require('passport-saml').Strategy;

  // var app = __meteor_bootstrap__.app;
  var connect = require('connect');
  var app = connect();
 	app.use(passport.initialize());
	app.use(passport.session());

	Meteor.Router.add({
		'/login': function(){
			console.log('before passport');
			passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
		  function(req, res) {
		    Meteor.Router.to('bubbleList');
		  }
			console.log('after passport');
		},
		'/login/callback': function(){
			passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
		  function(req, res) {
		    Meteor.Router.to('bubbleList');
		  }
		},
	});

  passport.use(new SamlStrategy(
	  {
	    path: '/login/callback',
	    entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
	    issuer: 'passport-saml'
	  },
	  function(profile, done) {
	    console.log(profile);

	    var user = Meteor.users.find({email:profile.email});

	    if (!user) {
	    	// user = Meteor.user.insert({email:profile.email});
	    }

	  	return done(null,user);

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

});