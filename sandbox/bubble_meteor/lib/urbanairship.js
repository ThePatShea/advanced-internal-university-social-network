
if(Meteor.isClient) {
  getUA = function getUA(user, callback) { 
    Meteor.call('getUA', user, callback);
  }
}

if(Meteor.isServer) {
  var UA = Meteor.require('urban-airship');

  //Development
  var ua = new UA("M6oTTgCDSMeut2gd_otuPw", "Uqsut-XRT1axMge09Uvt8g", "_Px_WwOhS3eYa-LnznXeUA");
  //Production
  // var ua = new UA("gDW_RChbTGWRqpqgm4KU1g", "foQ--AD6ROeStqFL-h3u3w", "79LyvkEwT_a8uU6GlEt2iw");
  Meteor.methods({
    'getUA': function getUA(text, deviceToken) {
      var UA = Meteor.require('urban-airship');
      var ua = new UA("M6oTTgCDSMeut2gd_otuPw", "Uqsut-XRT1axMge09Uvt8g", "_Px_WwOhS3eYa-LnznXeUA");
      // var ua = new UA("gDW_RChbTGWRqpqgm4KU1g", "foQ--AD6ROeStqFL-h3u3w", "79LyvkEwT_a8uU6GlEt2iw");

      var urbanairship = Meteor.sync(function(done) {
        var payload0 = {
           "device_tokens": [
              deviceToken
             ],
           "aps": {
               "alert": text,
               "badge": 2
           }
         };

         ua.pushNotification("/api/push", payload0, function(error) {
          console.log("this ran");
         });
      });

      return urbanairship.result;
    }
  });
}