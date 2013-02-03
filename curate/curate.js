// Require base scripts
	var base_aggregate = require("./aggregate.js");
	var base_sync = require("./sync.js");
	var base_sort = require("./sort.js");


// Concatenate the base functions
	exports.bubble_curate = function() {
		base_aggregate.bubble_aggregate();
		base_sync.bubble_sync();
		base_sort.bubble_sort();
	}
