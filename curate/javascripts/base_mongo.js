// Base mongoDB functions
	var mongoose = require('mongoose'), db = mongoose.createConnection('localhost', 'test');
	db.on('error', console.error.bind(console, 'connection error:'));


	exports.db_open = function(callback) {
		db.once('open', callback);
	}	


	var get_schema = exports.get_schema = function(schema, callback) {
		if (schema == "agg_facebook") {
			var mongo_schema = new mongoose.Schema({
				facebook_id: { type: Number, index: {unique: true}},
				type: String
			}, { collection: 'agg_facebook' });
		} else if (schema == "access_tokens") {
			var mongo_schema = new mongoose.Schema({
				uid: { type: Number, index: {unique: true}},
				access_token: { type: String, index: {unique: true}}
			}, { collection: 'access_tokens' });
		} else if (schema == "page") {
			var mongo_schema = new mongoose.Schema({
                                page_id: { type: Number, index: {unique: true}},
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
                        }, { collection: 'pages' });
		} else if (schema == "event") {
                        var mongo_schema = new mongoose.Schema({
                                eid: { type: Number, index: {unique: true}},
                                name: String,
                                pic_square: String,
                                pic_big: String,
                                description: String,
				start_time: Number,
				end_time: Number,
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
                        }, { collection: 'events' });
                } else if (schema == "user") {
                        var mongo_schema = new mongoose.Schema({
                                uid: { type: Number, index: {unique: true}},
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
				email: String
                        }, { collection: 'users' });
                } else if (schema == "bubble") {
			var mongo_schema = new mongoose.Schema({
				slug: { type: String, index: {unique: true}},
				name: String,
				events: []
			}, { collection: 'bubbles' });
		}

		var mongo_model = db.model(schema, mongo_schema);

		callback(mongo_model);
	}

	exports.get_user_array = function(callback)
	{
		get_schema("access_tokens", function (mongo_model) {
			mongo_model.find({ },function (err, mongo_model) {
				if (err) { } // TODO handle err

				var user_object = mongo_model;
				var user_object_length = user_object.length;

				var users = new Array();

				for (i = 0; i < user_object_length; i++) {
					users[i] = new Array();
					users[i]["facebook_user_id"] = user_object[i].uid;
					users[i]["access_token"] = user_object[i].access_token;
				}

				callback(users);
			});
		});
	}

	exports.get_default_access_token = function(callback) {
		get_schema("access_tokens", function (mongo_model) {
                        mongo_model.findOne({ },"access_token",function (err, mongo_model) {
				if (err) { } // TODO handle err

				var default_access_token = mongo_model.access_token;
				callback(default_access_token);
			 });
                });
	}

	exports.get_id_list = function(id_type, callback)
	{ // This function uses the confusing variable names "page_list" and "page_object". These variables can also represent events. Change the variable names to id_list and id_object to avoid confusion. I will need to change references to these variables in other scripts too.
		get_schema("agg_facebook", function (mongo_model) {
			mongo_model.find({ type: id_type },function (err, mongo_model) {
				if (err) { } // TODO handle err

				var page_object = mongo_model;
				var page_object_length = page_object.length;

				var page_list = new Array();
				page_list[0] = "";
				var a = 0;

				for (i = 0; i < page_object_length; i++) {
					if (i != 0  &&  i%1000 == 0) {
						a++;
						page_list[a] = "";
					}

					if (i%1000 != 0)
						page_list[a] += ",";

					page_list[a] += "\\'"+page_object[i].facebook_id+"\\'";
				}
				callback(page_list);
			});
		});
	}


	exports.sort_bubble = function(bubble_name, page_parameters) {
		get_schema("page", function (mongo_model) {
			mongo_model.find(page_parameters, "page_id").exec(function (err, mongo_model) {
				var page_object = mongo_model;
				var page_object_length = page_object.length;
				var page_array = new Array();

				for (i = 0; i < page_object_length; i++) {
					page_array[i] = page_object[i].page_id;
				}

				get_schema("event", function (mongo_model) {
					var current_time = Math.round((new Date()).getTime() / 1000);
					var yesterday = current_time - 86400;

					mongo_model.find({$or : [{creator : {$in : page_array}}, {"venue.id" : {$in : page_array}}], privacy : "OPEN"}, "eid name pic_big start_time end_time location venue.id creator").where("end_time").gt(current_time).where("start_time").gt(yesterday).exec(function (err, mongo_model) {
						var event_array = mongo_model;
						console.log(event_array);

						var bubble_regex = new RegExp(" ","g");
                                                var bubble_slug = bubble_name.replace(bubble_regex,"_");

						get_schema("bubble", function (mongo_model) {
							var insert_bubble = new mongo_model({slug : bubble_slug , name : bubble_name , events: event_array});
                        				insert_bubble.save();
						});
					});
				});
                        });
		});


	}


  exports.store_facebook_info = function(returnInfo, input_schema) {
    if(typeof(input_schema) === 'undefined') input_schema = "agg_facebook";

    get_schema(input_schema, function (mongo_model) {
        console.log(returnInfo);

        var returnInfo_length  =  returnInfo.data.length;

        for (i = 0; i < returnInfo_length; i++)
        {
                var resultName =  returnInfo.data[i].name;

                if (resultName == "user" || resultName == "event" || resultName == "page")
                {
                        var insertInfo         =  returnInfo.data[i].fql_result_set;
                        var insertInfo_length  =  insertInfo.length;

                        for (j = 0; j < insertInfo_length; j++) {
				if (input_schema == "agg_facebook") {
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
					// Make this work as an upsert. Find out if the save() function automatically upserts
					var insert_sync = new mongo_model(insertInfo[j]);
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
    });

  }
