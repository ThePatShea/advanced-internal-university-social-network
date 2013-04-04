// Talk schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var TalkSchema = new Schema({
    comments: [{type : Schema.ObjectId, ref : 'Comment'}]
  , bubbles: [{type : Schema.ObjectId, ref : 'Bubble'}]
  , creator: {type : Schema.ObjectId, ref : 'User'}
  , createdAt: {type : Date, default : Date.now}
  , privacy: {type: String, default: 'private'}
  , post_type: {type: String, default: 'talk'}
  , description: String
  , name: String
  , connections: {
        users: {
            viewed:  [{type: Schema.ObjectId, ref: 'User'}]
        }
    }
})

mongoose.model('Talk', TalkSchema)
