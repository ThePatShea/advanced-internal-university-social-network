
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
    , authorized_widgets : function (req, res, next) {
        if (req.post.creator == req.user.id) {
          res.render('posts/change_post_image', {
              bubble_section: req.bubble_section
            , bubble: req.bubble
            , post: req.post
          }, function(err, change_post_image) {
            req.change_post_image = change_post_image
            next()
          })
        } else {
            req.change_post_image = ''
            next()
        }
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
    , detect_authorization : function (req, res, next) {
        // Detect whether the user created the current bubble
          if (req.bubble.creator == req.user.id) {
            req.view_sidebar  =  'sidebar_bubble_authorized'
            req.view_list     =  'list_authorized'
          } else {
            req.view_sidebar  =  'sidebar_bubble_unauthorized'
            req.view_list     =  'list_unauthorized'
          }
        
 
        // Detect whether the user created the current post
          if (req.post != undefined) {
            if (req.post.creator == req.user.id) {
              req.view_post     =  'post_authorized'
            } else {
              req.view_post     =  'post_unauthorized'
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
