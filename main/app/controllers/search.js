// Include the models
  var mongoose  =  require('mongoose')
    , User      =  mongoose.model('User')

// Define main functions
  // Search for users
    exports.users = function(req, res) {
      var search_query = new RegExp(req.query.term,'i')

      User
        .find({name: search_query}, 'name facebook')
        .limit(20)
        .exec(function(err, users) {
          var name_array = new Array()
          
          for (var i=0; i < users.length; i++) { 
            name_array[i] = { 
                label: '<section>' + '<img src="https://graph.facebook.com/' + users[i].facebook.id + '/picture?type=square"/>'  + users[i].name + '</section> <section class="hidden">  <div class="user_id">' + users[i]._id + '</div>  </section>'
              , value: users[i].name
            }
          }

          res.send(name_array)
        })
    }
