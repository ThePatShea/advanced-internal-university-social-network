// Include base scripts
  // Include the models
    var mongoose  =  require('mongoose')
      , Bubble    =  mongoose.model('Bubble')
      , Event     =  mongoose.model('Event')
      , Deal      =  mongoose.model('Deal')
      , _         =  require('underscore')
      , rackit    =  require('rackit')


// Define main functions
  // Upload a file
    exports.upload = function(req, res) {
      var input_file    =  req.files.input_file
      var file_path     =  input_file.path

      rackit.init({
          'user' : 'campusbubble',
          'key' : 'f12ab1992b6f9252fcce6be07091afd5'
      }, function(err) {
          rackit.add(file_path, function(err, cloudpath) {
              var object        =  req.object

              object.pic_big    =  rackit.getURI(cloudpath)

              object.save(function(err, doc) {
                res.redirect('/bubbles/'+req.bubble._id+'/'+req.bubble_section+'/view/'+req.post._id)
              })
          })
      })
    }
