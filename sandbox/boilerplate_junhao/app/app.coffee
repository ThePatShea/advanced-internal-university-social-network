express  =  require('express')
routes   =  require('./routes')
api      =  require('./routes/api')
app      =  module.exports = express()
http     =  require('http')

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

app.get '/', routes.index
app.get '/partials/:name', routes.partials

# JSON API

app.get '/api/posts', api.posts
app.get '/api/post/:id', api.post
app.post '/api/post', api.addPost
app.put '/api/post/:id', api.editPost
app.delete '/api/post/:id', api.deletePost

# redirect all others to the index (HTML5 history)
app.get '*', routes.index

# Start server

http.createServer(app).listen 3000, ->
  console.log 'Express server listening on port 3000'
