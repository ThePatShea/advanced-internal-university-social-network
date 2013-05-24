// Bubble schema
var mongoose  =  require('mongoose')
  , Schema    =  mongoose.Schema

var BubbleSchema = new Schema({
    bubble_type:   {type: String, default: 'student organization'}
  , pic_big:       {type: String, default: '/img/default.jpg'}
  , exclusivity:   {type: String, default: 'closed'}
  , createdAt:     {type: Date,   default: Date.now}
  , name:          {type: String, default: ''}
  , location:      {type: String}
  , connections: {
        posts: {
            events_public: [{type: Schema.ObjectId, ref: 'Event'}]
          , talks_public:  [{type: Schema.ObjectId, ref: 'Talk'}]
          , events:        [{type: Schema.ObjectId, ref: 'Event'}]
          , talks:         [{type: Schema.ObjectId, ref: 'Talk'}]
        }
      , users: {
            applicants:    [{type: Schema.ObjectId, ref: 'User'}]
          , invitees:      [{type: Schema.ObjectId, ref: 'User'}]
          , members:       [{type: Schema.ObjectId, ref: 'User'}]
          , admins:        [{type: Schema.ObjectId, ref: 'User'}]
          , fans:          [{type: Schema.ObjectId, ref: 'User'}]
        }
    }
  , num_connections: {
        num_posts: {
            num_events_public: {type: Number, default: 0}
          , num_talks_public:  {type: Number, default: 0}
          , num_events:        {type: Number, default: 0}
          , num_talks:         {type: Number, default: 0}
        }
      , num_users: {
            num_applicants:    {type: Number, default: 0}
          , num_invitees:      {type: Number, default: 0}
          , num_members:       {type: Number, default: 0}
          , num_admins:        {type: Number, default: 0}
          , num_fans:          {type: Number, default: 0}
        }
    }
})

mongoose.model('Bubble', BubbleSchema)
