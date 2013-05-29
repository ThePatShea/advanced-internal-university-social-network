require  '../models/post' 
mongoose = require("mongoose")
Post = mongoose.model("Post")
_ = require("underscore")

# GET
exports.posts = (req, res) ->
  posts = [] 
  Post.find {}, (err, items) ->
    items.forEach (item) ->
      posts.push
        _id: item.id
        title: item.title
        text: item.text

    res.json posts: posts

exports.post = (req, res) ->
  id = req.params.id
  if id 
    Post.findById id, (err, item) ->
      res.json post: item
  else
    res.json false


# POST
exports.addPost = (req, res) ->
  post = new Post({title:req.body.title , text:req.body.text})
  post.save (err, product) ->
    console.log err  if err
  res.json post

# PUT
exports.editPost = (req, res) ->
  id = req.params.id
  if id 
    Post.findById id, (err, item) ->
      item = _.extend(item, req.body)
      item.save (err, product) ->
        console.log err  if err
        res.json true
  else
    res.json false


# DELETE
exports.deletePost = (req, res) ->
  id = req.params.id
  if id 
    Post.findById id, (err,item) ->
      item.remove (err, product) ->
        console.log err  if err
        res.json true
  else
    res.json false