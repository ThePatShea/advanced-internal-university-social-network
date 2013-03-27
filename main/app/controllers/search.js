// Include the models
  var mongoose  =  require('mongoose')
    , User      =  mongoose.model('User')

// Define main functions
  // Search for users
    exports.users = function(req, res) {
      var search_query = new RegExp(req.query.term,'i')

      User
        .find({name: search_query}, 'name')
        .limit(20)
        .exec(function(err, users) {
          var name_array = new Array()
          
          for (var i=0; i < users.length; i++) { 
            name_array[i] = users[i].name
          }

          res.send(name_array)
        })
    }
