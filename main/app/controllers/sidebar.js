// Define main functions
  // View the sidebar for a bubble
    exports.bubble = function(req, res, next) {
      var bubble_connect_status = req.bubble_connect_status

      if (bubble_connect_status == 'admin' || bubble_connect_status == 'member')
        var view_params = bubble_connect_status
      else
        var view_params = 'other'

      res.render('sidebar/sidebar_bubble_' + view_params, {
          bubble_connect_status: req.bubble_connect_status
        , bubble: req.bubble
      }, function(err, rendered_sidebar) {
        if(err) console.log(err)
 
        req.rendered_sidebar = rendered_sidebar
        next()
      })
    }

  // View the sidebar for a bubble
    exports.user = function(req, res, next) {
      res.render('sidebar/sidebar_user', function(err, rendered_sidebar) {
        if(err) console.log(err)

        req.rendered_sidebar = rendered_sidebar
        next()
      })
    }
