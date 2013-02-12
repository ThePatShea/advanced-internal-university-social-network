
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
 *  Article authorizations routing middleware
 */

exports.article = {
    hasAuthorization : function (req, res, next) {
      if (req.article.user.id != req.user.id) {
        return res.redirect('/articles/'+req.article.id)
      }
      next()
    }
}


/*
 *  Event authorizations routing middleware
 */

exports.event = {
      hasAuthorization : function (req, res, next) {
        if (req.event.creator != req.user.id) {
          return res.redirect('/bubbles/'+req.bubble.id+'/events/'+req.event.id)
        }
        next()
      }
    , hasAuthorization_upload : function (req, res, next) {
        if (req.event.creator === req.user.id) {
          return res.redirect('/bubbles/'+req.bubble.id+'/events/'+req.event.id)
        } else {
          next()
        }
      }
}
