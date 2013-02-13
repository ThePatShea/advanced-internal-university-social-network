
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
        if (req.bubble.creator != req.user.id) {
          return res.redirect('/bubbles/'+req.bubble._id)
        }

        next()
      }
    , edit_bubble : function (req, res, next) {
        req.edit_bubble  =  'true'
        next()
      }
    , detect_authorization : function (req, res, next) {
        // Detect whether the user created the current bubble
          if (req.bubble.creator == req.user.id) {
            req.view_sidebar  =  'sidebar_bubble_authorized'
            req.view_list     =  'list_authorized'
            
            if (req.edit_bubble == 'true')
              req.view_sidebar  +=  '_edit'
          } else {
            req.view_sidebar  =  'sidebar_bubble_unauthorized'
            req.view_list     =  'list_unauthorized'
          }
        
 
        // Detect whether the user created the current post
          if (req.post != undefined) {
            if (req.post.creator == req.user.id) {
              req.view_post     =  'single_post_authorized'
            } else {
              req.view_post     =  'single_post_unauthorized'
            }
          }

         
        // Detect whether the user is subscribed to the current bubble
          if (req.user.subscriptions.indexOf(req.bubble._id) >= 0) {
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
