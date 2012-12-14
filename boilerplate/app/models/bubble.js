// Bubble schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var BubbleSchema = new Schema({
	name: String,
        description: String,
        privacy: String,
        creator: {type : Schema.ObjectId, ref : 'User'},
	events: []
})



mongoose.model('Bubble', BubbleSchema)
