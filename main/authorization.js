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
      hasAuthorization : function (req, res, next) {
        if (req.profile.id != req.user.id) {
          return res.redirect('/users/'+req.profile.id)
        }
        next()
      }
    , render_sidebar : function (req, res, next) {
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
      hasAuthorization : function (req, res, next) {
        if (req.post.creator != req.user.id) {
          return res.redirect('/bubbles/'+req.bubble._id+'/'+req.bubble_section+'/view/'+req.post._id)
        }

        next()
      }
}


/*
 *  Bubble authorizations routing middleware
 */

exports.bubble = {
      hasAuthorization : function (req, res, next) {
        if (req.bubble.connections.users.admins.indexOf(req.user.id) > -1) {
          next()
        } else {
          return res.redirect('/bubbles/'+req.bubble._id)
        }
      }
    , edit_bubble : function (req, res, next) {
        req.edit_bubble  =  'true'
        next()
      }
    , detect_authorization : function (req, res, next) {
        // Detect whether the user is an admin of the current bubble
          if (req.bubble.connections.users.admins.indexOf(req.user.id) > -1) {
            req.bubble_connect_status = 'admin'

            req.view_sidebar    =  'sidebar_bubble_authorized'
            req.view_dashboard  =  'dashboard_authorized'
            req.view_list       =  'list_authorized_'
             
            req.view_list      +=  req.bubble_section

            if (req.edit_bubble == 'true')
              req.view_sidebar  +=  '_edit'
          } else if (req.bubble.connections.users.members.indexOf(req.user.id) > -1) {
            req.bubble_connect_status = 'member'


          } else if (req.bubble.connections.users.fans.indexOf(req.user.id) > -1) {
            req.bubble_connect_status = 'fan'

            req.view_sidebar    =  'sidebar_bubble_unauthorized'
            req.view_dashboard  =  'dashboard_unauthorized'
            req.view_list       =  'list_unauthorized'
          } else if (req.bubble.connections.users.applicants.indexOf(req.user.id) > -1) {
            req.bubble_connect_status = 'applicant'


          } else {
            req.bubble_connect_status = 'none'

            req.view_sidebar    =  'sidebar_bubble_unauthorized'
            req.view_dashboard  =  'dashboard_unauthorized'
            req.view_list       =  'list_unauthorized'
          }
        
 
        // Detect whether the user created the current post
          if (req.post != undefined) {
            // Set the single post view
              req.view_post  =  'single_'

            // Set the bubble section
              req.view_post  += req.bubble_section

            // Set whether the user is authorized
              if (req.post.creator == req.user.id) {
                req.view_post  +=  '_authorized_'
              } else {
                req.view_post  +=  '_unauthorized_'
              }
          }

         
        // Detect whether the user is subscribed to the current bubble
          if (req.bubble.connections.users.fans.indexOf(req.user._id) > -1) {
            req.user_subscribed  =  1
          } else {
            req.user_subscribed  =  0
          }

          
        // Render the sidebar, then run the next function
          res.render('sidebar/' + req.view_sidebar, {
              user_subscribed: req.user_subscribed
            , bubble: req.bubble
          }, function(err, rendered_sidebar) { 
            if(err) console.log(err)

            req.rendered_sidebar  =  rendered_sidebar
            next()
          })
      }
}
