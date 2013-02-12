// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Event     =  mongoose.model('Event')
      , Deal      =  mongoose.model('Deal')
      , _         =  require('underscore')
      , rackit    =  require('rackit')

  // Include the posts controller
    var posts  =  require('./posts')



// Define main functions
  // Upload a file
    exports.upload = function(req, res) {
      rackit.init({
          'user' : 'campusbubble',
          'key' : 'f12ab1992b6f9252fcce6be07091afd5'
      }, function(err) {
          rackit.add(__dirname + req.file_path, function(err, cloudpath) {
              console.log(rackit.getURI(cloudpath));
          });
      });
    }
