require('../models/post');
mongoose = require("mongoose")
Post = mongoose.model("Post")
_ = require("underscore")

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
    items.forEach (item) ->
      posts.push
        id: item.id
        title: item.title
        text: item.text.substr(0, 50) + "..."

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
  res.json req.body
  # data.posts.push req.body
  # res.json req.body


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