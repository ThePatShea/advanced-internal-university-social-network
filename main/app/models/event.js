// Event schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var EventSchema = new Schema({
    comments: [{type : Schema.ObjectId, ref : 'Comment'}]
  , pic_big: {type: String, default: '/img/default.jpg'}
  , bubbles: [{type : Schema.ObjectId, ref : 'Bubble'}]
  , creator: {type : Schema.ObjectId, ref : 'User'}
  , createdAt: {type : Date, default : Date.now}
  , attending_count: {type: Number, default: 0}
  , post_type: {type: String, default: 'event'}
  , privacy: {type: String, default: 'private'}
  , description: String
  , location: String
  , start_time: Date
  , end_time: Date
  , name: String
  , connections: {
        users: {
            notified:  [{type: Schema.ObjectId, ref: 'User'}]
          , viewed:    [{type: Schema.ObjectId, ref: 'User'}]
          , going:     [{type: Schema.ObjectId, ref: 'User'}]
        }
    }
})

mongoose.model('Event', EventSchema)
