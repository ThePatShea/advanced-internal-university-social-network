express  =  require 'express'
views    =  require './views'
post     =  require './controller/post'
app      =  module.exports = express()
http     =  require 'http'

# Bootstrap db connection
mongoose = require('mongoose')
mongoose.connect 'mongodb://localhost/test'

app.configure ->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.static(__dirname + '/public')
  app.use app.router

app.configure 'development', ->
  app.use express.errorHandler()

# Routes

app.get '/', views.index
app.get '/partials/:name', views.partials

# JSON API

app.get '/api/posts', post.posts
app.get '/api/post/:id', post.post
app.post '/api/post', post.addPost
app.put '/api/post/:id', post.editPost
app.delete '/api/post/:id', post.deletePost

# redirect all others to the index (HTML5 history)
app.get '*', views.index

# Start server

http.createServer(app).listen 3000, ->
  console.log 'Express server listening on port 3000'
