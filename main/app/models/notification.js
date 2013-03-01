// Notification schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var NotificationSchema = new Schema({
    bubble: {type : Schema.ObjectId, ref : 'Bubble'}
  , creator: {type : Schema.ObjectId, ref : 'User'}
  , createdAt: {type : Date, default : Date.now}
  , description: {type : String}
  , subscriptions: [{
      id: {type : Schema.ObjectId, ref : 'User'}
    , clicked: {type: Boolean, default: false}
    , seen: {type: Boolean, default: false}
  }]
})

mongoose.model('Notification', NotificationSchema)
