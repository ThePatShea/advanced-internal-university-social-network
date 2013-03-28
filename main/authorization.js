// Authorize sign in
  exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated())
      return res.redirect('/login')

    next()
  };


// Authorize user
  exports.user = {
      hasAuthorization: function (req, res, next) {
        if (req.profile.id != req.user.id)
          return res.redirect('/users/'+req.profile.id)

        next()
      }
  }


// Authorize post
  exports.post = {
      hasAuthorization: function (req, res, next) {
        if (req.post.creator != req.user.id)
          return res.redirect('/bubbles/' + req.bubble._id + '/' + req.bubble_section + '/view/' + req.post._id)
  
        next()
      }
    , get_connect_status: function (req, res, next) {
             if (req.user.connections.bubbles.admin.indexOf(req.bubble.id) > -1)
          req.post_connect_status  =  'admin'
        else if (req.post.creator == req.user.id)
          req.post_connect_status  =  'creator'
        else 
          req.post_connect_status  =  'none'
        
        next()
      }
  }


// Authorize bubble
  exports.bubble = {
      hasAuthorization: function (req, res, next) {
        if (req.user.connections.bubbles.admin.indexOf(req.bubble.id) > -1)
          next()
        else
          return res.redirect('/bubbles/' + req.bubble._id)
      }
    , get_connect_status: function (req, res, next) {
             if (req.user.connections.bubbles.applicant.indexOf(req.bubble.id)  >  -1)
          req.bubble_connect_status  =  'applicant'
        else if (req.user.connections.bubbles.invitee.indexOf(req.bubble.id)    >  -1)
          req.bubble_connect_status  =  'invitee'
        else if (req.user.connections.bubbles.member.indexOf(req.bubble.id)     >  -1)
          req.bubble_connect_status  =  'member'
        else if (req.user.connections.bubbles.admin.indexOf(req.bubble.id)      >  -1)
          req.bubble_connect_status  =  'admin'
        else if (req.user.connections.bubbles.fan.indexOf(req.bubble.id)        >  -1)
          req.bubble_connect_status  =  'fan'
        else
          req.bubble_connect_status  =  'none'
  
        next()
      }
}
