# initialize our faux database

# actually we may not need this?????????????????


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
  data.posts.forEach (post, i) ->
    posts.push
      id: i
      title: post.title
      text: post.text.substr(0, 50) + "..."


  res.json posts: posts

exports.post = (req, res) ->
  id = req.params.id
  if id >= 0 and id < data.posts.length
    res.json post: data.posts[id]
  else
    res.json false


# POST
exports.addPost = (req, res) ->
  data.posts.push req.body
  res.json req.body


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
  if id >= 0 and id < data.posts.length
    data.posts.splice id, 1
    res.json true
  else
    res.json false