// Event schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var EventSchema = new Schema({
	eid: { type: Number, index: {unique: true}},
	name: String,
	pic_square: String,
	pic_big: String,
	description: String,
	start_time: String,
	end_time: String,
	location: String,
	venue: {
		id: Number
	},
	privacy: String,
	creator: Number,
	update_time: Number,
	attending_count: Number,
	declined_count: Number,
	unsure_count: Number,
	not_replied_count: Number
})



mongoose.model('Event', EventSchema)
