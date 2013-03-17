// Include the models
  var mongoose  =  require('mongoose')
    , _         =  require('underscore')


// Define main functions
  // View a list of posts in a bubble
    exports.list = function(req, res) {
      var bubble_section  =  req.bubble_section
        , bubble          =  req.bubble

      res.render('posts/'+req.view_list, {
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
        var bubble_section  =  req.bubble_section
          , skip            =  req.params.skip
          , bubble          =  req.bubble

      // Initialize query parameters
        var query_parameters_find      =  req.query_parameters_find
        var query_parameters_sort      =  req.query_parameters_sort
        query_parameters_find.bubbles  =  req.bubble._id
        Post                           =  req.Post
 
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
      var bubble  =  req.bubble
        , Post    =  req.Post

      bubble.save(function (err) {
        var post = new Post(req.body)
        post.bubbles.addToSet(bubble._id)
        post.creator = req.user._id

        post.save(function(err) {
          req.post = post
          next()
        })

      })
    }


  // Show a post
    exports.show = function(req, res) {
      res.render('posts/' + req.view_post + 'show', {
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


  // Edit a post
    exports.edit = function(req, res) {
     res.render('posts/' + req.view_post + 'edit', {
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
