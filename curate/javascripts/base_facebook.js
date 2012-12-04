// Require base scripts
	var base_mongo = require("./base_mongo.js");

// Base Facebook functions
	var get_from_facebook = exports.get_from_facebook = function(query, access_token, input_schema)
	{
		base_mongo.get_default_access_token(function(default_access_token){
			if(typeof(access_token) === 'undefined' || access_token == "default_access_token")
				access_token = default_access_token;

			var https = require('https');

			https.get("https://graph.facebook.com/"+query+"&access_token="+access_token, function(res) {

				var returnData = "";

				res.on("data", function(chunk) {
					returnData += chunk;
				});

				res.on("end", function() {
					var returnInfo = JSON.parse(returnData);
					base_mongo.store_facebook_info(returnInfo, input_schema);
				});

			}).on('error', function(e) {
				console.log("Got error: " + e.message);
			});
		});
	}


	exports.agg_from_users = function(query, end_parens, input_schema)
	{
		if(typeof(end_parens) === 'undefined') end_parens = "";

		base_mongo.get_user_array(function(users) {
			var users_length  =  users.length;

			for (i = 0; i < users_length; i++) {
				get_from_facebook("fql?q={"+query+" WHERE uid IN (SELECT uid2 FROM friend WHERE uid1="+users[i]["facebook_user_id"]+") OR uid="+users[i]["facebook_user_id"]+end_parens+"'}",users[i]["access_token"], input_schema);
			}
		});
	}

	exports.facebook_query_loop = function(type_input, type_output, query, end_parens, input_schema) {
		if(typeof(end_parens) === 'undefined') end_parens = "";
                 base_mongo.get_id_list(type_input, function(page_list){
                        var page_list_length = page_list.length;
                        for (i = 0; i < page_list_length; i++) {
				get_from_facebook("fql?q={'"+type_output+"':'"+query+" ("+page_list[i]+end_parens+")'}", "default_access_token", input_schema);
                        }
                });
        }
