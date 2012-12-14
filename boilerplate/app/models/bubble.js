// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
	name: String,
        description: String,
	events: []
})



mongoose.model('Bubble', BubbleSchema)
