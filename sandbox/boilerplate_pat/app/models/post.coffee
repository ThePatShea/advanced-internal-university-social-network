mongoose 	= require("mongoose")
Schema 		= mongoose.Schema

postSchema  = new Schema {
  title: {
    type: String
    default: ""
    trim: true
  },

  text:{
    type: String
    default: ""
    trim: true
  }
}

postSchema.path("title").validate ((title) ->
  title.length > 0
), "Post title cannot be blank"

postSchema.path("text").validate ((body) ->
  body.length > 0
), "Post text cannot be blank"


Post = mongoose.model("Post", postSchema)
module.exports = Post
# post = new Post(
#   title: "Title"
#   body: "Body"
# )
# post.save