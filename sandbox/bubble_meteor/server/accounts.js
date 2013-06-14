Accounts.registerLoginHandler(function(loginRequest){
  // passport.use(new SamlStrategy(
  //   {
  //     path: '/login/callback',
  //     entryPoint: 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
  //     issuer: 'passport-saml'
  //   },
  //   function(loginRequest, done) {
  //     findByEmail(loginRequest.email, function(err, user) {
  //       if (err) {
  //         return done(err);
  //       }
  //       return done(null, user);
  //     });
  //   }
  // ));
 
 //  // passport.authenticate('saml', { failureRedirect: '/', failureFlash: true } );
 //  passport.use(new LocalStrategy(
	//   function(email, password , done) {
	//   	console.log("this worked");
	//     Meteor.users.findOne({ email: loginRequest.email }, function (err, user) {
	//       if (err) { return done(err); }
	//       if (!user) {
	//         return done(null, false, { message: 'Incorrect username.' });
	//       }
	//       if (!user.validPassword(password)) {
	//         return done(null, false, { message: 'Incorrect password.' });
	//       }
	//       return done(null, user);
	//     });
	//   }
	// ));


});

Meteor.Router.add('/login','POST', function(){
	var loginRequest = {
      email: this.request.body.email,
      password: this.request.body.password
    };
  console.log("Post before");
	/*passport.authenticate('local', { successRedirect: '/bubbleList',failureRedirect: '/' }, function(){
		console.log('POST:');
	});*/

  passport.authenticate('basic', function(req, res) {
    console.log("authentication ran");
    res.json(req.user);
  });
	// this.statusCode = 302;
	// console.log(this.response);
	// this.end("hello");
	// console.log('POST after');
});

Meteor.Router.add({
	'/':'/bubbleList'
})

// Meteor.Router.add('/login','GET', function(){
// 	// console.log("GET works");
// 	passport.authenticate('local', { successRedirect: '/bubbleList',failureRedirect: '/login' });
// });
