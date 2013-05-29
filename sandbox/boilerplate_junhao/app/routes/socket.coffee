#
# * Serve content over a socket
# 

module.exports = (socket) ->
  #
  #To receive the emited socket data from angular controller
  #

 	#Add posts
  socket.on "add:post", (data) ->
	  socket.broadcast.emit "add:post",
	    post: data.post

  #Edit posts
  socket.on "edit:post", (data) ->
	  socket.broadcast.emit "edit:post",
	    post: data.post

	#Delete posts
  socket.on "delete:post", (data) ->
	  socket.broadcast.emit "delete:post",
	    post: data.post




