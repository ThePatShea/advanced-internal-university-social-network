var idx = lunr(function() {
	this.field('name');
});

// var doc1 = {
//     "name": "Taggart Bowen-Gaddy",
//     "id": "1"
// };

// var doc2 = {
// 	"name": "Xavier Fernandes",
// 	"id": "2"
// };

// var doc3 = {
// 	"name": "Pat Shea",
// 	"id": "3"
// };

// var doc4 = {
// 	"name": "xa",
// 	"id": "4"
// };

// idx.add(doc1);
// idx.add(doc2);
// idx.add(doc3);
// idx.add(doc4);

var items = Meteor.users.find({}, {fields: {'name': 1, '_id': 1}});
items.forEach(function(item) {
	var tmpDoc = {
		"name": item.name,
		"id": item._id
	};
	idx.add(tmpDoc)
});
	
Meteor.methods({
	search_users: function(q) {
		console.log("Query: " + q);
		var res = idx.search(q);
		var retVal = [];
		console.log(res);
		/*res.forEach(function(i) {
			if(i.score > .01)
			{
				retVal.push(i.ref);
			}
		})*/
		for(var i = 0; i < 10; i++)
		{
			if(typeof res[i] !== "undefined")
				retVal.push(res[i].ref)
		}
		return retVal;
	},
	addToIndex: function(id, name) {
		var tmp = {
			"name": name,
			"id": id
		};
		idx.add(tmp);
	}
});