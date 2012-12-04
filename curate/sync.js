// Require base scripts
        var base_facebook = require("./javascripts/base_facebook.js");
        var base_mongo = require("./javascripts/base_mongo.js");


// Sync Facebook attributes scripts
	function sync_events() { base_facebook.facebook_query_loop("event","event","SELECT eid,name,pic_square,pic_big,description,start_time,end_time,location,venue.id,privacy,creator,update_time,attending_count,declined_count,unsure_count,not_replied_count FROM event WHERE eid IN","","event"); }
	function sync_pages() { base_facebook.facebook_query_loop("page","page","SELECT page_id,name,description,categories,pic_square,pic_big,pic_cover,type,mission,products,location.street,location.zip,location.city,location.state,location.latitude,location.longitude,phone,username,about,fan_count,hours,parking FROM page WHERE page_id IN","","page"); }
	function sync_users() { base_facebook.agg_from_users("'user':'SELECT name,pic_cover,pic_big,pic_square,username,first_name,middle_name,last_name,sex,email,uid FROM user","", "user");  }


// Concatenate the sync functions
	exports.bubble_sync = function() {
		sync_events();
		sync_pages();
		sync_users();
	}
