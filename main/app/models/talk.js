// Talk schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var TalkSchema = new Schema({
	name: String,
	pic_square: String,
	pic_big: String,
	description: String,
	creator: [{type : Schema.ObjectId, ref : 'User'}],
        comments: [{type : Schema.ObjectId, ref : 'Comment'}],
        bubbles: [{type : Schema.ObjectId, ref : 'Bubble'}]
})



mongoose.model('Talk', TalkSchema)
