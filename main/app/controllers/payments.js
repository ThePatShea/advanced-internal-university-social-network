// Include base scripts
  var mongoose  =  require('mongoose')


// Initialize Stripe authorization credentials
  var stripeApiKeyTesting = "sk_test_BChwgXIdtRK3VbAOU3n4HYLo";
  var stripeApiKey = "sk_live_MEyrnnycBVAD6cL56HqElb7M";
  var stripe = require('stripe')(stripeApiKeyTesting);


// Define main functions
  // Enroll a customer in a monthly payment plan
    exports.enroll_monthly = function(req, res) {
      stripe.customers.create({
        card : req.body.stripeToken,
        email : req.user.email, // customer's email (get it from db or session)
        plan : "company_bubble"
      }, function (err, customer) {
        if (err) {
          var msg = customer.error.message || "unknown";
          res.send("Error while processing your payment: " + msg);
        }
        else {
          var id = customer.id;
          console.log('Success! Customer with Stripe ID ' + id + ' just signed up!');
          // save this customer to your database here!
          res.send('ok');
        }
      });
    }
