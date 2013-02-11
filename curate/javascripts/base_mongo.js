// Base mongoDB functions
	if (process.env.NODE_ENV == 'production')
		var db_connect = 'mongodb://nodejitsu_campusbubble:vn94subvihmm5j843t4to71s5g@ds049537.mongolab.com:49537/nodejitsu_campusbubble_nodejitsudb9203155674';   // Production database
	else
		var db_connect = 'mongodb://nodejitsu_campusbubble:mm0hjn9lob87vt9eopnpshp13b@ds049537.mongolab.com:49537/nodejitsu_campusbubble_nodejitsudb4086692456';   // Development database

	// TESTING
		// var db_connect = 'mongodb://nodejitsu_campusbubble:vn94subvihmm5j843t4to71s5g@ds049537.mongolab.com:49537/nodejitsu_campusbubble_nodejitsudb9203155674';   // Production database
	// TESTING

	var mongoose  =  require('mongoose')
          , db        =  mongoose.createConnection(db_connect)
          , Schema    =  mongoose.Schema


	db.on('error', console.error.bind(console, 'connection error:'));


	exports.db_open = function(callback) {
		db.once('open', callback);
	}	


	// Initialize the models
		var Agg_facebookSchema = new Schema({
			facebook_id: { type: Number, index: {unique: true}},
			type: String
		}, { collection: 'agg_facebook' });

		var Agg_facebook = db.model('Agg_facebook', Agg_facebookSchema);


		var PageSchema = new Schema({
                        page_id: { type: Number, index: {unique: true, sparse: true}},
                        name: String,
			description: String,
			categories: [],
			pic_square: String,
			pic_big: String,
			pic_cover: String,
			type: String,
			mission: String,
			products: String,
			location: {
				street: String,
				zip: String,
				city: String,
				state: String,
				latitude: Number,
				longitude: Number
			},
			phone: String,
			username: String,
			about: String,
			fan_count: Number,
			hours: [],
			parking: {
				street: Number,
				lot: Number,
				valet: Number
			}
                });

		var Page = db.model('Page', PageSchema);


                var EventSchema = new Schema({
			eid: { type: Number, index: {unique: true, sparse: true}},
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
			creator: Schema.Types.Mixed,
			update_time: Number,
			attending_count: { type: Number, default: 0},
			declined_count: Number,
			unsure_count: Number,
			not_replied_count: Number,
			comments: [{type : Schema.ObjectId, ref : 'Comment'}],
			bubbles: [{type : Schema.ObjectId, ref : 'Bubble'}]
                });

		var Event = db.model('Event', EventSchema);


                var UserSchema = new Schema({
                        uid: { type: Number, index: {unique: true, sparse: true}},
                        name: String,
			pic_cover: {
				cover_id: Number,
				source: String,
				offset: Number
			},
                        pic_square: String,
                        pic_big: String,
			username: String,
			first_name: String,
			middle_name: String,
			last_name: String,
			sex: String,
			email: String,
                        facebook: {}
                });

		var User = db.model('User', UserSchema);


		var BubbleSchema = new Schema({
			  creator: {type : Schema.ObjectId, ref : 'User', default: new mongoose.Types.ObjectId}
			, subscriptions: [{type : Schema.ObjectId, ref : 'User', index: {unique: true}}]
			, num_subscriptions: {type: Number, default: 0}
			, privacy: {type: String, default: 'public'}
			, type: {type: String, default: 'curated'}
			, num_events: {type: Number, default: 0}
			, num_deals: {type: Number, default: 0}
			, num_talks: {type: Number, default: 0}
			, description: String
			, name: String
		});
		
		var Bubble = db.model('Bubble', BubbleSchema);


	exports.get_user_array = function(callback)
	{
		User.find({ "facebook.access_token" : { $ne: null } },"facebook.access_token facebook.id",function (err, mongo_model) {
			if (err) { } // TODO handle err

			var user_object = mongo_model;
			var user_object_length = user_object.length;

			var users = new Array();

			for (i = 0; i < user_object_length; i++) {
				users[i] = new Array();
				users[i]["facebook_user_id"] = user_object[i].facebook.id;
				users[i]["access_token"] = user_object[i].facebook.access_token;
			}

			callback(users);
		});
	}

	exports.get_default_access_token = function(callback) {
                User.findOne({ "facebook.access_token" : { $ne: null } },"facebook.access_token",function (err, mongo_model) {
			if (err) { } // TODO handle err
			var default_access_token = mongo_model.facebook.access_token;
			callback(default_access_token);
		});
	}

	exports.get_id_list = function(id_type, callback)
	{ // This function uses the confusing variable names "page_list" and "page_object". These variables can also represent events. Change the variable names to id_list and id_object to avoid confusion. I will need to change references to these variables in other scripts too.
		Agg_facebook.find({ type: id_type },function (err, mongo_model) {
			if (err) { } // TODO handle err

			var page_object = mongo_model;
			var page_object_length = page_object.length;

			var page_list = new Array();
			page_list[0] = "";
			var a = 0;

			for (i = 0; i < page_object_length; i++) {
				if (i != 0  &&  i%250 == 0) {
					a++;
					page_list[a] = "";
				}

				if (i%250 != 0)
					page_list[a] += ",";

				page_list[a] += "\\'"+page_object[i].facebook_id+"\\'";
			}
			callback(page_list);
		});
	}


	exports.sort_bubble = function(bubble_name, page_parameters) {
		Page.find(page_parameters, "page_id").exec(function (err, mongo_model) {
			var page_object = mongo_model;
			var page_object_length = page_object.length;
			var page_array = new Array();

			for (i = 0; i < page_object_length; i++) {
				page_array[i] = page_object[i].page_id;
			}

			var timestamp_now            =  (new Date()) / 1000
			var timestamp_six_hours_ago  =  timestamp_now - 21600

			Event.find({$or : [{creator : {$in : page_array}}, {"venue.id" : {$in : page_array}}], end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_six_hours_ago}, privacy : "OPEN"}).exec(function (err, events) {
				//console.log(events);

				Bubble
				  .findOne({name: bubble_name, type: 'curated'})
				  .exec(function (err, bubble) {
				  	if (!bubble) bubble = new Bubble({name : bubble_name})
					
					events.forEach(function(event) {
					    // Prevent duplicate events
						Event
						  .find({location: event.location, start_time: event.start_time, bubbles: bubble._id, eid: {$ne : event.eid} })
						  .exec(function (err, duplicate_events) {
							if (duplicate_events != "") {
								duplicate_events.forEach(function(duplicate_event) {
									console.log('Found duplicate event: ' + duplicate_event.name)
									if (event.attending_count > duplicate_event.attending_count) {
										duplicate_event.bubbles.remove(bubble._id)
										event.bubbles.addToSet(bubble._id)
										
										duplicate_event.save()
										event.save()
									} else {
										event.bubbles.remove(bubble._id)
										event.save()
									}
								})
							} else {
								event.bubbles.addToSet(bubble._id)
								event.save()
							}
						  })
					})
					
					// Update num_events for the bubble
						Event
						  .find({ bubbles: bubble._id, end_time: {$gt: timestamp_now}, start_time: {$gt: timestamp_six_hours_ago} }, "_id")
						  .exec(function (err, events) {
							bubble.num_events = events.length
							bubble.save()
						  })
				  })
			});
                });
	}


  exports.store_facebook_info = function(returnInfo, input_schema) {
    if(typeof(input_schema) === 'undefined') input_schema = "Agg_facebook";

    // Capitalize the first letter of the input_schema
      input_schema = input_schema.charAt(0).toUpperCase() + input_schema.slice(1);

    mongo_model = db.model(input_schema);

    console.log(returnInfo);

    // Prevents a facebook error from crashing the script
	if (returnInfo.data != undefined)
	    var returnInfo_length  =  returnInfo.data.length;
	else
	    var returnInfo_length  =  0;

    for (i = 0; i < returnInfo_length; i++)
    {
            var resultName =  returnInfo.data[i].name;

            if (resultName == "user" || resultName == "event" || resultName == "page")
            {
                    var insertInfo         =  returnInfo.data[i].fql_result_set;
                    var insertInfo_length  =  insertInfo.length - 1;

                    for (j = 0; j < insertInfo_length; j++) {
    			if (input_schema == "Agg_facebook") {
    				if (resultName == "user") {
    					var insert_id = insertInfo[j].uid;
    					var insert_type = "user";
    				} else if (resultName == "event") {
    					var insert_id = insertInfo[j].eid;
    					var insert_type = "event";
    				} else if (resultName == "page") {
    					var insert_id = insertInfo[j].page_id;
    					var insert_type = "page";
    				}

    				var insert_agg_facebook = new mongo_model({facebook_id: insert_id, type: insert_type});
    				insert_agg_facebook.save();
    			} else {
				var insert_sync = new mongo_model(insertInfo[j]);

				// Convert event start_time and end_time to unix timestamp
                        	        if (resultName == "event") {
						if (parseInt(insert_sync.start_time) != insert_sync.start_time)
							insert_sync.start_time  =  ( Date.parse(insert_sync.start_time) ) / 1000
						
						if (parseInt(insert_sync.end_time) != insert_sync.end_time)
							insert_sync.end_time    =  ( Date.parse(insert_sync.end_time)   ) / 1000
					}
				
				// Testing upsert
					if (resultName == "event") {
						Event
						  .findOne({eid: insert_sync.eid})
						  .exec(function(err, event) {
							if (event) {
								console.log('testing upsert: ' + event.name)   // TESTING
							}
						  })
					}

                        	insert_sync.save();
    			}
                    }
            } else if (!resultName) {   // Special case for Facebook Graph API search queries
                var insertInfo = returnInfo.data[i];
    		var insert_id = insertInfo.id;

    		if (insertInfo["start_time"]) {   // If it's an event
    			var insert_type = "event";
    		} else {   // If it's a page
    			var insert_type = "page";
    		}

    		var insert_agg_facebook = new mongo_model({facebook_id: insert_id, type: insert_type});
    		insert_agg_facebook.save();
            }
    }
  }
