// Event schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var EventSchema = new Schema({
	eid: { type: Number, index: {unique: true, sparse: true}},
	name: String,
	pic_square: String,
	pic_big: {type: String, default: '/img/default.jpg'},
	description: String,
	start_time: String,
	end_time: String,
	location: String,
	venue: {
		id: Number
	},
	privacy: String,
	creator: Schema.Types.Mixed,
	update_time: Number,
	attending_count: { type: Number, default: 0},
	declined_count: Number,
	unsure_count: Number,
	not_replied_count: Number,
        comments: [{type : Schema.ObjectId, ref : 'Comment'}],
        bubbles: [{type : Schema.ObjectId, ref : 'Bubble'}]
})



mongoose.model('Event', EventSchema)
