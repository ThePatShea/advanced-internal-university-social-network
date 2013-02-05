// Require base scripts
	var base_facebook = require("./javascripts/base_facebook.js");
	var base_mongo = require("./javascripts/base_mongo.js");

	
// Aggregate Pages	
	function agg_from_events_venues_creators() { base_facebook.facebook_query_loop("event","page","SELECT page_id FROM page WHERE page_id IN (SELECT venue.id,creator FROM event WHERE eid IN", ")"); }
	function agg_from_pages_likes() { base_facebook.facebook_query_loop("page","page","SELECT page_id FROM page_fan WHERE uid IN"); } // Currently not using this script because it adds way too many irrelevant pages to the database
	function agg_from_users_likes() { base_facebook.agg_from_users("'page':'SELECT page_id FROM page_fan"); }

	function agg_from_search_pages() {
		base_facebook.get_from_facebook("search?q=%20&type=place&fields=id&center=33.755,-84.39&distance=10000&limit=5000");
		base_facebook.get_from_facebook("search?q=Georgia&fields=id&type=place&limit=5000");
		base_facebook.get_from_facebook("search?q=Atlanta&fields=id&type=place&limit=5000");
		base_facebook.get_from_facebook("search?q=Decatur&fields=id&type=place&limit=5000");
		base_facebook.get_from_facebook("search?q=Emory&fields=id&type=place&limit=5000");
		base_facebook.get_from_facebook("search?q=GA&fields=id&type=place&limit=5000");
		
		base_facebook.get_from_facebook("search?q=Georgia&fields=id&type=page&limit=5000");
		base_facebook.get_from_facebook("search?q=Atlanta&fields=id&type=page&limit=5000");
		base_facebook.get_from_facebook("search?q=Decatur&fields=id&type=page&limit=5000");
		base_facebook.get_from_facebook("search?q=Emory&fields=id&type=page&limit=5000");
		base_facebook.get_from_facebook("search?q=GA&fields=id&type=page&limit=5000");
	}


// Aggregate Events
	function agg_from_pages_events() { base_facebook.facebook_query_loop("page","event","SELECT eid,start_time,end_time FROM event WHERE eid IN (SELECT eid FROM event_member WHERE uid IN", ")"); }
	function agg_from_users_events() { base_facebook.agg_from_users("'event':'SELECT eid,start_time,end_time FROM event WHERE eid IN (SELECT eid FROM event_member",")"); }

	function agg_from_search_events() {
		base_facebook.get_from_facebook("search?q=Georgia%20&type=event&fields=id,start_time,end_time&center=33.755,-84.39&distance=10000&limit=5000");
		base_facebook.get_from_facebook("search?q=Atlanta%20&type=event&fields=id,start_time,end_time&center=33.755,-84.39&distance=10000&limit=5000");
		base_facebook.get_from_facebook("search?q=Decatur%20&type=event&fields=id,start_time,end_time&center=33.755,-84.39&distance=10000&limit=5000");
		base_facebook.get_from_facebook("search?q=Emory%20&type=event&fields=id,start_time,end_time&center=33.755,-84.39&distance=10000&limit=5000");
		base_facebook.get_from_facebook("search?q=GA%20&type=event&fields=id,start_time,end_time&center=33.755,-84.39&distance=10000&limit=5000");

		base_facebook.get_from_facebook("search?q=Georgia&fields=id,start_time,end_time&type=event&limit=5000");
		base_facebook.get_from_facebook("search?q=Atlanta&fields=id,start_time,end_time&type=event&limit=5000");
		base_facebook.get_from_facebook("search?q=Decatur&fields=id,start_time,end_time&type=event&limit=5000");
		base_facebook.get_from_facebook("search?q=Emory&fields=id,start_time,end_time&type=event&limit=5000");
		base_facebook.get_from_facebook("search?q=GA&fields=id,start_time,end_time&type=event&limit=5000");
	}


// Concatenate the aggregate functions
	exports.bubble_aggregate = function() {
		base_mongo.db_open(function() {
			// Aggregate pages
				agg_from_events_venues_creators();    // Gets pages from events' venues and creators
				agg_from_search_pages();              // Gets pages from our search queries
				agg_from_users_likes();               // Gets pages from users' likes

			// Aggregate events
				agg_from_search_events();             // Gets events from our search queries
				agg_from_users_events();              // Gets events users are invited to
				agg_from_pages_events();              // Gets events posted by pages
		});
	}
