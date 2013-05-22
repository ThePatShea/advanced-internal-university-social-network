# Requires dependencies
  routes   =  require('./controllers/routes')
  api      =  require('./controllers/api')
  express  =  require('express')


# Creates a node server
  app = module.exports = express()


# Configures the server
  app.configure ->
    app.set 'views', __dirname + '/views'
    app.set 'view engine', 'jade'
    app.set 'view options',
      layout: false
    app.use express.bodyParser()
    app.use express.methodOverride()
    app.use express.static(__dirname + '/public')
    app.use app.router


# Configures the server for development mode
  app.configure 'development', ->
    app.use express.errorHandler(
      dumpExceptions : true
      showStack      : true
    )


# Configures the server for production mode
  app.configure 'production', ->
    app.use express.errorHandler()


# Sets routes
  # Sets partials routes
    app.get '/partials/:name'  , routes.partials

  # Sets routes that get called on the client
    app.delete '/api/post/:id' , api.deletePost
    app.put    '/api/post/:id' , api.editPost
    app.post   '/api/post'     , api.addPost
    app.get    '/api/posts'    , api.posts
    app.get    '/api/post/:id' , api.post

  # Sets index routes
    app.get '/'                , routes.index
    app.get '*'                , routes.index


# Starts the server
  app.listen 3000, ->
    console.log 'Express server listening on port 3000'
