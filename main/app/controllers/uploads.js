// Include base scripts
  var mongoose  =  require('mongoose')
    , rackit    =  require('rackit')


// Define main functions
  // Upload a file
    exports.upload = function(req, res) {
      var input_file  =  req.files.input_file
        , file_path   =  input_file.path

      rackit.init({
          'user' : 'campusbubble',
          'key' : 'f12ab1992b6f9252fcce6be07091afd5'
      }, function(err) {
          rackit.add(file_path, function(err, cloudpath) {
              var object        =  req.object

              object.pic_big    =  rackit.getURI(cloudpath)

              object.save(function(err, doc) {
                res.redirect(req.body.current_url)
              })
          })
      })
    }
