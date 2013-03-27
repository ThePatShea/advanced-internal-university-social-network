// Include the models
  var mongoose  =  require('mongoose')
    , Bubble    =  mongoose.model('Bubble')
    , User      =  mongoose.model('User')

// Define main functions
  // Search for users
    exports.users = function(req, res) {
      Bubble
        .findOne({_id: req.bubble._id}, 'connections.users')
        .exec(function(err, bubble) {
          var connected_users  =  bubble.connections.users.admins.concat(bubble.connections.users.members, bubble.connections.users.applicants, bubble.connections.users.invitees)
          var search_name      =  new RegExp(req.query.term,'i')
          var search_query     =  {name: search_name, _id: {$nin: connected_users} }
          
          User
            .find(search_query, 'name facebook')
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
    
        })
    }
