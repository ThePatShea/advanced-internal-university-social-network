// Deal schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var DealSchema = new Schema({
	name: String,
	pic_square: String,
	pic_big: {type: String, default: '/img/default.jpg'},
	description: String,
        discount: { type: Number, min: 1, max: 100 },
	location: String,
	creator: [{type : Schema.ObjectId, ref : 'User'}],
        comments: [{type : Schema.ObjectId, ref : 'Comment'}],
        bubbles: [{type : Schema.ObjectId, ref : 'Bubble'}]
})



mongoose.model('Deal', DealSchema)
