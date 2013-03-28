/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
      hasAuthorization: function (req, res, next) {
        if (req.profile.id != req.user.id) {
          return res.redirect('/users/'+req.profile.id)
        }
        next()
      }
    , render_sidebar: function (req, res, next) {
        // Render the sidebar, then run the next function
          res.render('sidebar/sidebar_user', function(err, rendered_sidebar) {
            if(err) console.log(err)

            req.rendered_sidebar  =  rendered_sidebar
            next()
          })
      }
}



/*
 *  Post authorizations routing middleware
 */

exports.post = {
    hasAuthorization: function (req, res, next) {
      if (req.post.creator != req.user.id)
        return res.redirect('/bubbles/'+req.bubble._id+'/'+req.bubble_section+'/view/'+req.post._id)

      next()
    }
  , get_connect_status: function (req, res, next) {
      if (req.user.connections.bubbles.admin.indexOf(req.bubble.id) > -1) {
        req.post_connect_status = 'admin'
      } else if (req.post.creator == req.user.id) {
        req.post_connect_status = 'creator'
      } else {
        req.post_connect_status = 'none'
      }
      
      next()
    }
  , assemble_view: function (req, res, next) {
      var post_connect_status = req.post_connect_status

      req.view_post = 'single_' + req.bubble_section

      if (post_connect_status == 'admin' || post_connect_status == 'creator') {
        req.view_post  +=  '_authorized_'
      } else {
        req.view_post  +=  '_unauthorized_'
      }

      next()
    }
}


/*
 *  Bubble authorizations routing middleware
 */

exports.bubble = {
    hasAuthorization: function (req, res, next) {
      if (req.user.connections.bubbles.admin.indexOf(req.bubble.id) > -1) {
        next()
      } else {
        return res.redirect('/bubbles/'+req.bubble._id)
      }
    }
  , get_connect_status: function (req, res, next) {
      if (req.user.connections.bubbles.admin.indexOf(req.bubble.id) > -1) {
        req.bubble_connect_status = 'admin'
      } else if (req.user.connections.bubbles.member.indexOf(req.bubble.id) > -1) {
        req.bubble_connect_status = 'member'
      } else if (req.user.connections.bubbles.fan.indexOf(req.bubble.id) > -1) {
        req.bubble_connect_status = 'fan'
      } else if (req.user.connections.bubbles.applicant.indexOf(req.bubble.id) > -1) {
        req.bubble_connect_status = 'applicant'
      } else if (req.user.connections.bubbles.invitee.indexOf(req.bubble.id) > -1) {
        req.bubble_connect_status = 'invitee'
      } else {
        req.bubble_connect_status = 'none'
      }

      next()
    }
  , edit_bubble : function (req, res, next) {
      req.edit_bubble  =  'true'
      next()
    }
  , assemble_view: function (req, res, next) {
      var bubble_connect_status = req.bubble_connect_status

      // Detect whether the user is an admin/member/fan/etc. of the current bubble
        if (bubble_connect_status == 'admin') {
          req.view_sidebar    =  'sidebar_bubble_authorized'
          req.view_dashboard  =  'dashboard_authorized'
          req.view_list       =  'list_authorized_'
           
          req.view_list      +=  req.bubble_section

          if (req.edit_bubble == 'true')
            req.view_sidebar  +=  '_edit'
        } else if (bubble_connect_status == 'member') {
          req.view_sidebar    =  'sidebar_bubble_unauthorized'
          req.view_dashboard  =  'dashboard_unauthorized'
          req.view_list       =  'list_unauthorized'
        } else if (bubble_connect_status == 'fan') {
          req.view_sidebar    =  'sidebar_bubble_unauthorized'
          req.view_dashboard  =  'dashboard_unauthorized'
          req.view_list       =  'list_unauthorized'
        } else if (bubble_connect_status == 'applicant') {
          req.view_sidebar    =  'sidebar_bubble_unauthorized'
          req.view_dashboard  =  'dashboard_unauthorized'
          req.view_list       =  'list_unauthorized'
        } else if (bubble_connect_status == 'invitee') {
          req.view_sidebar    =  'sidebar_bubble_unauthorized'
          req.view_dashboard  =  'dashboard_unauthorized'
          req.view_list       =  'list_unauthorized'
        } else if (bubble_connect_status == 'none') {
          req.view_sidebar    =  'sidebar_bubble_unauthorized'
          req.view_dashboard  =  'dashboard_unauthorized'
          req.view_list       =  'list_unauthorized'
        }
      
      
      // Detect whether the user is subscribed to the current bubble
        if (req.bubble.connections.users.fans.indexOf(req.user._id) > -1) {
          req.user_subscribed  =  1
        } else {
          req.user_subscribed  =  0
        }

        
      // Render the sidebar, then run the next function
        res.render('sidebar/' + req.view_sidebar, {
            bubble_connect_status: req.bubble_connect_status
          , user_subscribed: req.user_subscribed
          , bubble: req.bubble
        }, function(err, rendered_sidebar) { 
          if(err) console.log(err)

          req.rendered_sidebar  =  rendered_sidebar
          next()
        })
    }
}
