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

	mergeObjects: function(target, source) {
		var result = {};

		for (var n in target)
			result[n] = target[n];

		for (var n in source)
			result[n] = source[n];

		return result;
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

	mongoFindOne: function(collection, query, fields) {
	    var rawCollection = MongoHelper.getRawCollection(collection);
	    var future = new Future();

	    if (typeof query == 'string')
	    	query = {_id: query};

	    rawCollection.findOne(query, this.bindFuture(future));
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

	// Response helpers
	jsonResponse: function(code, payload) {
		return [code, {'Content-Type': 'application/json'}, JSON.stringify(payload)];
	},

	makeQueryResponse: function(apiOptions, queryOptions, data, viewOptions) {
		// Generate result
		var name = (viewOptions && viewOptions.name) || 'items';

		var result = {
			count: data.count,
			pages: Math.floor(data.count / queryOptions.limit) + ((data.count % queryOptions.limit > 0) ? 1 : 0),
			page: apiOptions.page
		};

		// Rename _id to id
		for (var n in data.items) {
			this.fromMongoModel(data.items[n]);
		}

		result[name] = data.items;

		return this.jsonResponse(200, result);
	},

	// Authentication
	headerAuth: function(ctx) {
		var authHeader = ctx.request.headers['x-authentication'];
		if (!authHeader)
			return false;

		var userId = RestCrypto.verifyToken(authHeader);
		if (!userId)
			return false;

		var user = Meteor.users.findOne(userId);
		if (!user)
			return false;

		ctx.userId = userId;
		ctx.user = user;
		return true;
	},

	authUser: function(ctx, opts) {
		if (opts.authUser)
			return opts.authUser(ctx, opts);

		return this.headerAuth(ctx);
	}
};
