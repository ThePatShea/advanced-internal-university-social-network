// Require base scripts
        var base_mongo = require("./javascripts/base_mongo.js");


// Sort bubbles
	exports.bubble_sort = function() {
		base_mongo.sort_bubble("concerts" , {$or : [{"type": /concert/i} , {"categories.name": /concert/i}] , "location.state" : "GA"});
		base_mongo.sort_bubble("night life" , {$or : [{"type": /night/i} , {"categories.name": /night/i}] , "location.state" : "GA"});
		base_mongo.sort_bubble("arts and music" , {$or : [{"type": /art/i} , {"categories.name": /art/i}] , "location.state" : "GA"});
		base_mongo.sort_bubble("campus events" , {$or : [{"type": /Emory/} , {"description": /Emory/}] , "location.state" : "GA"});
	}
