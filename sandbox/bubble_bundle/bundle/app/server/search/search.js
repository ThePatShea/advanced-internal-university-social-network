var bubble_idx = lunr(function() {
	this.field('title');
});
var user_idx = lunr(function() {
	this.field('name');
});
var event_idx = lunr(function() {
	this.field('name');
});
var file_idx = lunr(function() {
	this.field('name');
});
var discussion_idx = lunr(function() {
	this.field('name');
});

//ADD CURRENT USERS TO INDEX
var users = Meteor.users.find({}, {fields: {'name': 1, '_id': 1}});
users.forEach(function(user) {
	var tmpDoc = {
		"name": user.name,
		"id": user._id
	};
	user_idx.add(tmpDoc)
});

//ADD CURRENT BUBBLES TO INDEX: collections/bubbles.js
//ADD CURRENT EVENTS,DISCUSSIONS,FILES TO INDEX: collections/posts.js
	
Meteor.methods({
	reindex: function() {

		//ADD CURRENT USERS TO INDEX
		var users = Meteor.users.find({}, {fields: {'name': 1, '_id': 1}});
		users.forEach(function(user) {
			var tmpDoc = {
				"name": user.name,
				"id": user._id
				};
			user_idx.add(tmpDoc)
		});

		//ADD CURRENT BUBBLES TO SEARCH INDEX
		var bubbles = Bubbles.find({}, {fields: {'title': 1, '_id': 1}});
		bubbles.forEach(function(bubble) {
		  Meteor.call("addBubbleToIndex", bubble._id, bubble.title);
		});

		//ADD EVENTS TO INDEX
		var events = Posts.find({postType: "event"}, {fields: {'name': 1, '_id': 1}});
		events.forEach(function(event) {
		  Meteor.call("addEventToIndex", event._id, event.name);
		});
		//ADD DISCUSSIONS TO INDEX
		var discussions = Posts.find({postType: "discussion"}, {fields: {'name': 1, '_id': 1}});
		discussions.forEach(function(discussion) {
		  Meteor.call("addDiscussionToIndex", discussion._id, discussion.name);
		});
		//ADD FILES TO INDEX IF THEY HAVE A BUBBLEID
		var files = Posts.find({postType: "file", bubbleId: {$exists: true}}, {fields: {'name': 1, '_id': 1}});
		files.forEach(function(file) {
		  Meteor.call("addFileToIndex", file._id, file.name);
		});
	},
	search_users: function(q) {
		console.log("Query: " + q);
		var res = user_idx.search(q);
		var retVal = [];
		console.log(res);
		_.each(res, function(i) {
			retVal.push(i.ref)
		});
		return retVal;
	},
	search_bubbles: function(q) {
		console.log("Query: " + q);
		var res = bubble_idx.search(q);
		var retVal = [];
		console.log(res);
		_.each(res, function(i) {
			retVal.push(i.ref)
		});
		return retVal;
	},
	search_events: function(q) {
		console.log("Query: " + q);
		var res = event_idx.search(q);
		var retVal = [];
		console.log(res);
		_.each(res, function(i) {
			retVal.push(i.ref)
		});
		return retVal;
	},
	search_discussions: function(q) {
		console.log("Query: " + q);
		var res = discussion_idx.search(q);
		var retVal = [];
		console.log(res);
		_.each(res, function(i) {
			retVal.push(i.ref)
		});
		return retVal;
	},
	search_files: function(q) {
		console.log("Query: " + q);
		var res = file_idx.search(q);
		var retVal = [];
		console.log(res);
		_.each(res, function(i) {
			retVal.push(i.ref)
		});
		return retVal;
	},


	//GO BACK TO ALL INSTANCES OF "addToIndex" AND CHANGE TO "addUserToIndex"!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	addToIndex: function(id, name) {
		var tmp = {
			"name": name,
			"id": id
		};
		user_idx.add(tmp);
		console.log("ADDED TO USER INDEX: " + name);
	},
	addUserToIndex: function(id, name) {
		var tmp = {
			"name": name,
			"id": id
		};
		user_idx.add(tmp);
		console.log("ADDED TO USER INDEX: " + name);
	},
	//collections/bubbles.js, /view/bubble/bubble_submit.js
	addBubbleToIndex: function(id, title) {
		var tmp = {
			"title": title,
			"id": id
		};
		bubble_idx.add(tmp);
		console.log("ADDED TO BUBBLE INDEX: " + title);
	},
	//collections/post.js
	addEventToIndex: function(id, name) {
		var tmp = {
			"name": name,
			"id": id
		};
		event_idx.add(tmp);
		console.log("ADDED TO EVENT INDEX: " + name);
	},
	addDiscussionToIndex: function(id, name) {
		var tmp = {
			"name": name,
			"id": id
		};
		discussion_idx.add(tmp);
		console.log("ADDED TO DISCUSSION INDEX: " + name);
	},
	addFileToIndex: function(id, name) {
		var tmp = {
			"name": name,
			"id": id
		};
		file_idx.add(tmp);
		console.log("ADDED TO FILE INDEX: " + name);
	}
});