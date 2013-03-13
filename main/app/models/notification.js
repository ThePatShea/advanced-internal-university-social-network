// Notification schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var NotificationSchema = new Schema({
    subscriptions: [{type : Schema.ObjectId, ref : 'User'}]
  , bubble: {type : Schema.ObjectId, ref : 'Bubble'}
  , creator: {type : Schema.ObjectId, ref : 'User'}
  , createdAt: {type : Date, default : Date.now}
  , description: {type : String}
  , post: {
        _id: Schema.Types.ObjectId
      , post_type: String
    }
})

mongoose.model('Notification', NotificationSchema)
