# Require dependencies
api      =  require('./routes/api')
routes   =  require('./routes')
express  =  require('express')
http     =  require('http')


# Start the server
app      =  module.exports = express()


# Configure the server
app.configure ->
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.static(__dirname + '/public')
  app.use app.router


# Configure development mode for the server
app.configure 'development', ->
  app.use express.errorHandler()


# Set the routes
  # Set the partials routes
  app.get    '/partials/:name' , routes.partials

  # Set the create/read/update/delete routes
  app.delete '/api/post/:id'   , api.deletePost
  app.put    '/api/post/:id'   , api.editPost
  app.post   '/api/post'       , api.addPost
  app.get    '/api/posts'      , api.posts
  app.get    '/api/post/:id'   , api.post

  # Set the index routes
  app.get    '*'               , routes.index
  app.get    '/'               , routes.index


# Start the server
http.createServer(app).listen 3000, ->
  console.log 'Express server listening on port 3000'
