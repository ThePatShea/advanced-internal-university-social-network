// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
    subscriptions: [{type : Schema.ObjectId, ref : 'User'}]
  , pic_big: {type: String, default: '/img/default.jpg'}
  , creator: {type : Schema.ObjectId, ref : 'User'}
  , num_subscriptions: {type: Number, default: 0}
  , createdAt: {type : Date, default : Date.now}
  , num_events: {type: Number, default: 0}
  , num_talks: {type: Number, default: 0}
  , description: String
  , name: String
})

mongoose.model('Bubble', BubbleSchema)
