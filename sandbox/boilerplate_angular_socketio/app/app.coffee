# Requires the dependencies
post      =  require './controller/post'
_         =  require 'underscore'
mongoose  =  require 'mongoose'
express   =  require 'express'
views     =  require './views'
stylus    =  require 'stylus'
http      =  require 'http'
fs        =  require 'fs'

# Creates the server
app       =  module.exports = express()

# Socket.io Communication
socket    = require("./controller/socket")
server    =  http.createServer(app)
io        =  require('socket.io').listen(server)

# Connects to the database
mongoose.connect 'mongodb://localhost/test'


# Configures the server
app.configure ->
  # Sets Jade as the HTML templating engine
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'

  # Sets Stylus as the CSS preprocessor
  app.use stylus.middleware(__dirname + '/public')

  # # Configures Express
  app.use express.bodyParser()
  app.use express.methodOverride()

  # # Sets the router and static to handle URL requests
  app.use express.static(__dirname + '/public')
  app.use app.router

# Configures development mode for the server
app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

# Bootstrap models
models_path = __dirname + "/models"
model_files = fs.readdirSync(models_path)
model_files.forEach (file) ->
  require models_path + '/' + file

# Sets the routes
app.get    '/partials/:name', views.partials

# Sets the create/read/update/delete routes
app.delete '/api/post/:id' , post.deletePost
app.put    '/api/post/:id' , post.editPost
app.post   '/api/post'     , post.addPost
app.get    '/api/posts'    , post.posts
app.get    '/api/post/:id' , post.post

# Sets the index routes
app.get '/', views.index
app.get '*', views.index

# Socket.io Communication

io.sockets.on('connection', socket);

# Start server
server.listen 3000, ->
  console.log "Express server listening on port %d in %s mode", @address().port, app.settings.env

