// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
	  name: String
        , description: String
        , privacy: String
        , creator: {type : Schema.ObjectId, ref : 'User'}
	, events: []
	, subscriptions: [{type : Schema.ObjectId, ref : 'User', index: {unique: true}}]
        , num_subscriptions: {type: Number, default: 0}
        , num_deals: {type: Number, default: 0}
})


mongoose.model('Bubble', BubbleSchema)
