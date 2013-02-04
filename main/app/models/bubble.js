// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
          creator: {type : Schema.ObjectId, ref : 'User', default: new mongoose.Types.ObjectId}
	, subscriptions: [{type : Schema.ObjectId, ref : 'User', index: {unique: true}}]
        , num_subscriptions: {type: Number, default: 0}
        , privacy: {type: String, default: 'public'}
        , type: {type: String, default: 'manual'}
        , num_events: {type: Number, default: 0}
        , num_deals: {type: Number, default: 0}
        , num_talks: {type: Number, default: 0}
        , description: String
	, name: String
})


mongoose.model('Bubble', BubbleSchema)
