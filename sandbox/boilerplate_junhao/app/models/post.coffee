mongoose 	= require("mongoose")
Schema 		= mongoose.Schema

postSchema  = new Schema {
  title: {
    type: String
    default: ""
    trim: true
  },

  body:{
    type: String
    default: ""
    trim: true
  }
}

postSchema.path("title").validate ((title) ->
  title.length > 0
), "Post title cannot be blank"

postSchema.path("body").validate ((body) ->
  body.length > 0
), "Post body cannot be blank"


Post = mongoose.model("Post", postSchema)
module.exports = Post
# post = new Post(
#   title: "Title"
#   body: "Body"
# )
# post.save