require('../models/post');
mongoose = require("mongoose")
Post = mongoose.model("Post")
# _ = require("underscore")

# initialize our faux database
data = posts: [
  title: "Lorem ipsum"
  text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
,
  title: "Sed egestas"
  text: "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
]

# GET
exports.posts = (req, res) ->
  posts = [] 
  Post.find {}, (err, items) ->
    items.forEach (item, i) ->
      posts.push
        # id: i
        # title: item.title
        # text: item.body.substr(0, 50) + "..."
        # console.log item

    res.json posts: items

exports.post = (req, res) ->
  id = req.params.id
  if id >= 0 
    Post.findById id (err,obj) ->
      res.json post: obj
  else
    res.json false


# POST
exports.addPost = (req, res) ->
  post = new Post({title:req.body.title , body:req.body.text})
  post.save (err, product) ->
    console.log err  if err
  res.json req.body
  # data.posts.push req.body
  # res.json req.body


# PUT
exports.editPost = (req, res) ->
  id = req.params.id
  if id >= 0 and id < data.posts.length
    data.posts[id] = req.body
    res.json true
  else
    res.json false


# DELETE
exports.deletePost = (req, res) ->
  id = req.params.id
  if id
    Post.findById id (err, post) ->
      post.remove (err, post) ->
        return handleError(err) if err
    res.json true
  else
    res.json false