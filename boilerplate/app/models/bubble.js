// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
	slug: { type: String, index: {unique: true}},
	name: String,
	events: []
})



mongoose.model('Bubble', BubbleSchema)
