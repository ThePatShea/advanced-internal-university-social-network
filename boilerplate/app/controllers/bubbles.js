var mongoose = require('mongoose')
  , Bubble = mongoose.model('Bubble')
  , _ = require('underscore')


// Subscribe to a bubble
  var subscribe = exports.subscribe = function (req, res) {
    var user = req.user
      , bubble = req.bubble
    
    bubble.subscriptions.addToSet(user._id)
  
    Bubble
      .findOne({"_id" : bubble._id}, "name num_subscriptions")
      .exec(function(err, bubbles) {
        bubble.num_subscriptions++
        bubble.save(function (err) {
          user.subscriptions.addToSet(bubble._id)
          user.save(function (err) {
            res.redirect(req.body.current_url)
          })
        })
      })
  }


// Unsubscribe from a bubble
  exports.unsubscribe = function (req, res) {
    var user = req.user
      , bubble = req.bubble
  
    bubble.subscriptions.remove(user._id)
  
    Bubble
      .findOne({"_id" : bubble._id}, "name num_subscriptions")
      .exec(function(err, bubbles) {
        bubble.num_subscriptions--
        bubble.save(function (err) {
          user.subscriptions.remove(bubble._id)
          user.save(function (err) {
            res.redirect(req.body.current_url)
          })
        })
      })
  }


// Create a bubble
  exports.create = function (req, res) {
    var bubble = new Bubble(req.body)
    bubble.creator = req.user
    bubble.privacy = "CLOSED"

    bubble.save(function(err) {
      req.body.current_url = '/bubbles/' + bubble._id
      req.bubble = bubble
      subscribe(req,res)
    })
  }


// Edit a bubble
  exports.edit = function(req, res) {
    res.render('bubbles/edit', {
        sidebar_name: req.bubble.name
      , title: req.bubble.name
      , bubble_section: 'none'
      , bubble: req.bubble
    })
  }
