var Future = Npm.require('fibers/future');

var DEFAULT_LIMIT = 10;
var MAX_LIMIT = 50;

this.RestHelpers = {
	// Return callback function that will either rethrow exception or
	// satisfy future with a result
	bindFuture: function(future) {
		return function(err, result) {
			if (err) {
				future.throw(err);
			} else {
				future.return(result);
			}
		};
	},

	// Get list of fields from query string value
	getFieldList: function(fieldList) {
		if (fieldList) {
			var fields = fieldList.split(',');
			var result = {};

			for (var f in fields)
				result[fields[f]] = true;

			return result;
		}

		return null;
	},

	// Generate MongoDB options
	buildOptions: function(apiOptions) {
		if (apiOptions) {
			var options = {};

			options.limit = apiOptions.limit || DEFAULT_LIMIT;

			if (options.limit > MAX_LIMIT) {
				options.limit = MAX_LIMIT;
			}

			if (apiOptions.page) {
				options.skip = apiOptions.page * options.limit;
			}

			return options;
		}

		return {
			limit: DEFAULT_LIMIT
		};
	},

	fromMongoModel: function(model) {
		model.id = model._id;
		delete model._id;
		return model;
	},

	toMongoModel: function(model) {
		model._id = model.id;
		delete model.id;
		return model;
	},

	// MongoDB helpers
	mongoFind: function(collection, query, fields, options) {
	    var rawCollection = MongoHelper.getRawCollection(collection);
	    var countFuture = new Future();
	    var itemsFuture = new Future();

	    rawCollection.find(query).count(this.bindFuture(countFuture));
	    rawCollection.find(query, fields, options).toArray(this.bindFuture(itemsFuture));

	    return {
			count: countFuture.wait(),
			items: itemsFuture.wait()
	    };
	},

	mongoFindOne: function(collection, id, fields) {
	    var rawCollection = MongoHelper.getRawCollection(collection);
	    var future = new Future();

	    rawCollection.findOne({_id: id}, this.bindFuture(future));
	    var obj = future.wait()

	    // MongoDB does not support field filtering with findOne
	    if (fields) {
			var result = {};

			for (var n in obj) {
				if (n === '_id' || fields[n])
					result[n] = obj[n];
			}

			return result;
	    }

	    return obj;
	},

	mongoInsert: function(collection, obj) {
		var rawCollection = MongoHelper.getRawCollection(collection);
		var future = new Future();

		rawCollection.insert(obj, this.bindFuture(future));
		return future.wait();
	},

	mongoUpdate: function(collection, id, obj) {
		var rawCollection = MongoHelper.getRawCollection(collection);
		var future = new Future();

		rawCollection.update({_id: id}, obj, {w: 1}, this.bindFuture(future));
		return future.wait() === 1;
	},

	mongoDelete: function(collection, id) {
		var rawCollection = MongoHelper.getRawCollection(collection);
		var future = new Future();

		rawCollection.remove({_id: id}, {w: 1}, this.bindFuture(future));
		return future.wait() === 1;
	},

	// HTTP helpers
	jsonResponse: function(code, payload) {
		return [code, {'Content-Type': 'application/json'}, JSON.stringify(payload)];
	}
};
