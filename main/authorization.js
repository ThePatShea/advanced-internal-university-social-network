// Authorize post
  exports.post = {
      get_connect_status: function (req, res, next) {
             if (req.user.connections.bubbles.admin.indexOf(req.bubble.id) > -1)
          req.post_connect_status  =  'admin'
        else if (req.user.connections.bubbles.member.indexOf(req.bubble.id) > -1)
          req.post_connect_status  =  'member'
        else if (req.post.creator == req.user.id)
          req.post_connect_status  =  'creator'
        else 
          req.post_connect_status  =  'none'
        
        next()
      }
    , redirect_creator_or_admin: function (req, res, next) {
        var post_connect_status  =  req.post_connect_status

        if (post_connect_status != 'creator' && post_connect_status != 'admin')
          return res.redirect('/bubbles/' + req.bubble._id + '/' + req.bubble_section + '/view/' + req.post._id)
        
        next()
      }
    , redirect_member_if_private: function (req, res, next) {
        var post_connect_status  =  req.post_connect_status

        if (req.post.privacy == 'private' && post_connect_status != 'member' && post_connect_status != 'admin')
          return res.redirect('/bubbles/' + req.bubble._id)
        
        next()
      }
  }


// Authorize bubble
  exports.bubble = {
      get_connect_status: function (req, res, next) {
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
    , redirect_member: function (req, res, next) {
        var bubble_connect_status = req.bubble_connect_status

        if (bubble_connect_status != 'admin' && bubble_connect_status != 'member')
          return res.redirect('/bubbles/' + req.bubble._id)
        
        next()
      }
    , redirect_admin: function (req, res, next) {
        var bubble_connect_status = req.bubble_connect_status

        if (bubble_connect_status != 'admin')
          return res.redirect('/bubbles/' + req.bubble._id)
        
        next()
      }
}


// Authorize user
  exports.user = {
      hasAuthorization: function (req, res, next) {
        if (req.profile.id != req.user.id)
          return res.redirect('/users/' + req.profile.id)

        next()
      }
  }


// Authorize sign in
  exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated())
      return res.redirect('/login')

    next()
  };
