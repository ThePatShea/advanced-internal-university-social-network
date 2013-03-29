// Include the models
  var mongoose       =  require('mongoose')
    , _              =  require('underscore')

// Include other controllers
  var notifications  =  require('./notifications')
    , bubbles        =  require('./bubbles')



// Define main functions
  // View a list of posts in a bubble
    exports.list = function(req, res) {
      var bubble_connect_status  =  req.bubble_connect_status
        , bubble_section         =  req.bubble_section
        , bubble                 =  req.bubble

      if (bubble_connect_status == 'admin' || bubble_connect_status == 'member')
        view_params = 'authorized_' + req.bubble_section
      else
        view_params = 'unauthorized'
 
      res.render('posts/list_' + view_params, {
          list_pagelet_url: '/bubbles/' + bubble._id + '/' + bubble_section + '/list_pagelet/'
        , rendered_sidebar: req.rendered_sidebar
        , bubble_section: bubble_section
        , title: bubble.name
        , bubble: bubble
      })
    }


  // View a subset of a list of posts in a bubble
    exports.list_pagelet = function(req, res) {
      // Define the bubble parameters
        var bubble_connect_status  =  req.bubble_connect_status
          , bubble_section         =  req.bubble_section
          , skip                   =  req.params.skip
          , bubble                 =  req.bubble

      // Initialize query parameters
        var query_parameters_find      =  req.query_parameters_find
        var query_parameters_sort      =  req.query_parameters_sort
        query_parameters_find.bubbles  =  req.bubble._id
        Post                           =  req.Post
 
      // Show only public posts to users who aren't an admin or member or this bubble
        if (bubble_connect_status != 'admin' && bubble_connect_status != 'member')
          query_parameters_find.privacy = 'public'

      // Find some posts the current bubble has
        Post
          .find(query_parameters_find)
          .sort(query_parameters_sort)
          .limit(20)
          .skip(skip)
          .exec(function (err, posts) {
            // Render the view
              res.render('posts/list_pagelet_' + bubble_section, {
                  bubble_section: bubble_section
                , format_date_bottom_count: skip
                , format_date_top_count: skip
                , bubble: bubble
                , posts: posts
              })
           })
    }


  // Create a post
    exports.create = function (req, res, next) {
      var bubble_section  =  req.bubble_section
        , bubble          =  req.bubble
        , Post            =  req.Post

      var post = new Post(req.body)
      post.bubbles.addToSet(bubble._id)
      post.creator = req.user._id

      post.save(function(err) {
        if (bubble_section == 'event') {
          bubble.connections.posts.events.addToSet(post._id)

          if (post.privacy == 'public')
            bubble.connections.posts.events_public.addToSet(post._id)
        } else if (bubble_section == 'talk') {
          bubble.connections.posts.talks.addToSet(post._id)

          if (post.privacy == 'public')
            bubble.connections.posts.talks_public.addToSet(post._id)
        }

        bubble.save(function (err) {
          req.post = post
          next()
        })
      })
    }


  // View a single post
    exports.single = function(req, res) {
      var post_connect_status = req.post_connect_status

      view_params = req.bubble_section

      if (post_connect_status == 'admin' || post_connect_status == 'creator') {
        view_params  +=  '_authorized_'
      } else {
        view_params  +=  '_unauthorized_'
      }

      res.render('posts/single_' + view_params + 'show', {
          change_post_image: req.change_post_image
        , rendered_sidebar: req.rendered_sidebar
        , bubble_section: req.bubble_section
        , format_date_bottom_count: 0
        , format_date_top_count: 0
        , comments: req.comments
        , title: req.post.name
        , bubble: req.bubble
        , post: req.post
      })
    }


  // Show a bubble's dashboard
    exports.dashboard = function(req, res) {
      var bubble_connect_status = req.bubble_connect_status
  
      if (bubble_connect_status == 'admin' || bubble_connect_status == 'member')
        view_params = 'authorized'
      else
        view_params = 'unauthorized'

      res.render('posts/dashboard_' + view_params, {
          list_pagelet_url: '/bubbles/' + req.bubble._id + '/dashboard/list_pagelet/'
        , bubble_connect_status: req.bubble_connect_status
        , change_post_image: req.change_post_image
        , rendered_sidebar: req.rendered_sidebar
        , bubble_section: req.bubble_section
        , format_date_bottom_count: 0
        , format_date_top_count: 0
        , comments: req.comments
        , title: req.bubble.name
        , bubble: req.bubble
        , post: req.post
      })
    }


  // Edit a single post
    exports.edit = function(req, res) {
      var post_connect_status = req.post_connect_status

      view_params = req.bubble_section

      if (post_connect_status == 'admin' || post_connect_status == 'creator') {
        view_params  +=  '_authorized_'
      } else {
        view_params  +=  '_unauthorized_'
      }

     res.render('posts/single_' + view_params + 'edit', {
          change_post_image: req.change_post_image
        , rendered_sidebar: req.rendered_sidebar
        , bubble_section: req.bubble_section
        , format_date_bottom_count: 0
        , format_date_top_count: 0
        , comments: req.comments
        , title: req.post.name
        , bubble: req.bubble
        , post: req.post
      }) 
    }


  // Save edits to a post
    exports.save = function(req, res) {
      var post = req.post

      post = _.extend(post, req.body)
    
      post.save(function(err, doc) {
        res.redirect('/bubbles/'+req.bubble._id+'/'+req.bubble_section+'/view/'+post._id)
      })
    }


  // Delete a post
    exports.delete = function(req, res, next) {
      var bubble_section  =  req.bubble_section
        , bubble          =  req.bubble
        , post            =  req.post

      if (bubble_section == 'event')
        bubble.connections.posts.events.remove(post._id)
      if (bubble_section == 'talk')
        bubble.connections.posts.talks.remove(post._id)
      
      bubble.save(function(err) {
        post.remove(function(err) {
          req.notification_delete_parameters  =  {'connections.post._id': post._id}
          req.body.redirect_url               =  '/bubbles/'+bubble._id

          next()
        })
      })
    }
