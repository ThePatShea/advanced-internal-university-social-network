var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var NotificationSchema = new Schema({
    createdAt:   {type: Date, default: Date.now}
  , description: {type: String}
  , connections: {
        users: {
            subscribers: [{type: Schema.ObjectId, ref: 'User'}]
          , creator:      {type: Schema.ObjectId, ref: 'User'}
        }
      , bubble: {type: Schema.ObjectId, ref: 'Bubble'}
      , post: {
            _id:       {type: Schema.Types.ObjectId}
          , post_type: {type: String}
        }
    }
})

mongoose.model('Notification', NotificationSchema)
