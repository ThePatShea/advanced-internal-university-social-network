#
# * Serve content over a socket
# 

require  '../models/post' 
mongoose = require("mongoose")
Post = mongoose.model("Post")
_ = require("underscore")

module.exports = (socket) ->
  # socket.emit "send:name",
  #   name: "Joe"

  # setInterval (->
  #   socket.emit "send:time",
  #     time: (new Date()).toString()

  # ), 1000
  
  socket.on "send:post", (data) ->
  	console.log "This is data: " + JSON.stringify(data)
	  socket.broadcast.emit "send:post",
	    post: data.post




