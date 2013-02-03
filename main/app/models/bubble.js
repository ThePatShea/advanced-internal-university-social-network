// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
	  name: String
        , description: String
        , privacy: String
        , creator: {type : Schema.ObjectId, ref : 'User', default: new mongoose.Types.ObjectId}
	, events: []
	, subscriptions: [{type : Schema.ObjectId, ref : 'User', index: {unique: true}}]
        , num_subscriptions: {type: Number, default: 0}
        , num_events: {type: Number, default: 0}
        , num_deals: {type: Number, default: 0}
        , num_talks: {type: Number, default: 0}
})


mongoose.model('Bubble', BubbleSchema)
