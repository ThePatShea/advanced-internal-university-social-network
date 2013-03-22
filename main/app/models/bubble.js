// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
    pic_big:       {type: String, default: '/img/default.jpg'}
  , createdAt:     {type: Date, default: Date.now}
  , description:   {type: String, default: ''}
  , name:          {type: String, default: ''}
  , connections: {
        posts: {
            events:     [{type: Schema.ObjectId, ref: 'Event'}]
          , talks:      [{type: Schema.ObjectId, ref: 'Talk'}]
        }
      , users: {
            applicants: [{type: Schema.ObjectId, ref: 'User'}]
          , members:    [{type: Schema.ObjectId, ref: 'User'}]
          , admins:     [{type: Schema.ObjectId, ref: 'User'}]
          , fans:       [{type: Schema.ObjectId, ref: 'User'}]
        }
    }
  , num_connections: {
        num_posts: {
            num_events:     {type: Number, default: 0}
          , num_talks:      {type: Number, default: 0}
          , num_total:      {type: Number, default: 0}
        }
      , num_users: {
            num_applicants: {type: Number, default: 0}
          , num_members:    {type: Number, default: 0}
          , num_admins:     {type: Number, default: 0}
          , num_total:      {type: Number, default: 0}
          , num_fans:       {type: Number, default: 0}
        }
    }
})

mongoose.model('Bubble', BubbleSchema)
