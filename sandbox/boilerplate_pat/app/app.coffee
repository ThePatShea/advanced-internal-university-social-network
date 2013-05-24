# Requires the dependencies
post      =  require './controller/post'
io        =  require 'socket.io'
mongoose  =  require 'mongoose'
views     =  require './views'
express   =  require 'express'
stylus    =  require 'stylus'
http      =  require 'http'


# Instantiates Express
app       =  module.exports = express()


# Connects to the database
mongoose.connect 'mongodb://localhost/test'


# Configures the server
app.configure ->
  # Sets Jade as the HTML templating engine
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'

  # Sets Stylus as the CSS preprocessor
  app.use stylus.middleware(__dirname + '/public')

  # Configures Express
  app.use express.bodyParser()
  app.use express.methodOverride()

  # Sets the router and static to handle URL requests
  app.use express.static(__dirname + '/public')
  app.use app.router


# Configures development mode for the server
app.configure 'development', ->
  app.use express.errorHandler()


# Sets the routes
  # Sets the partials routes
  app.get     '/partials/:name', views.partials

  # Sets the create/read/update/delete routes
  app.delete '/api/post/:id' , post.deletePost
  app.put    '/api/post/:id' , post.editPost
  app.post   '/api/post'     , post.addPost
  app.get    '/api/posts'    , post.posts
  app.get    '/api/post/:id' , post.post

  # Sets the index routes
  app.get '*', views.index
  app.get '/', views.index


# Creates the server
server = http.createServer(app)


# Sets Socket.io to listen to the server
io = io.listen server


# Sets the server to listen to port 3000
server.listen 3000, ->
  console.log 'Express server listening on port 3000'


# Sets socket.io parameters
io.sockets.on 'connection', (socket) ->
  socket.emit 'news',
    foo: 'bar'

  socket.on 'my other event', (data) ->
    console.log data
