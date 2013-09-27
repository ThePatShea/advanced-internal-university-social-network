this.RestCrud = {
	apiQuery: function(collection, opts) {
		return function() {
			// Get API options
			var apiOptions = {};

			if (opts && opts.apiOptsFn)
				apiOptions = opts.apiOptsFn(this);

			// Make query
			var queryOptions = RestHelpers.buildOptions(apiOptions);

			var query = null;
			if (opts && opts.queryFn)
				query = opts.queryFn(this);

			var data = RestHelpers.mongoFind(collection, query, apiOptions.fields || null, queryOptions);

			// Generate result
			var name = (opts && opts.name) || 'items';

			var result = {
				count: data.count,
				pages: Math.floor(data.count / queryOptions.limit) + ((data.count % queryOptions.limit > 0) ? 1 : 0),
				page: apiOptions.page
			};

			// Rename _id to id
			for (var n in data.items)
				RestHelpers.fromMongoModel(data.items[n]);

			result[name] = data.items;

			return RestHelpers.jsonResponse(200, result);
		};
	},

	apiQueryOne: function(collection, opts) {
		return function(id) {
			// Get API options
			var apiOptions = {};

			if (opts && opts.apiOptsFn)
				apiOptions = opts.apiOptsFn(this);

			// Run query
			var obj = RestHelpers.mongoFindOne(collection, id, apiOptions.fields || null);
			if (!obj) {
				// TODO: Better error logging/reporting
				return RestHelpers.jsonResponse(404, 'Not found.');
			}

			if (opts && opts.check) {
				if (!opts.check(obj)) {
					return RestHelpers.jsonResponse(401, 'Access denied.');
				}
			}

			// Rename _id to id
			obj = RestHelpers.fromMongoModel(obj);

			return RestHelpers.jsonResponse(200, obj);
		};
	},

	apiCreate: function(collection, opts) {
		return function() {
			// Safety checks
			var obj = this.request.body;

			if (obj.id) {
				// TODO: Better error logging/reporting
				return RestHelpers.jsonResponse(401, 'Access denied.');
			}
			obj.id = new Meteor.Collection.ObjectID().toHexString()

			if (opts && opts.check) {
				if (!opts.check(this, obj)) {
					// TODO: Better error logging/reporting
					return RestHelpers.jsonResponse(401, 'Access denied.');
				}
			}

			// Rename id to _id
			obj = RestHelpers.toMongoModel(obj);

			var result = RestHelpers.mongoInsert(collection, obj)
			return RestHelpers.jsonResponse(200, result);
		};
	},

	apiUpdate: function(collection, opts) {
		return function(id) {
			// Safety checks
			var obj = this.request.body;

			if (obj.id != id) {
				// TODO: Better error logging/reporting
				return RestHelpers.jsonResponse(401, 'Access denied.');
			}

			if (opts && opts.check) {
				if (!opts.check(this, obj)) {
					// TODO: Better error logging/reporting
					return RestHelpers.jsonResponse(401, 'Access denied.');
				}
			}

			obj = RestHelpers.fromMongoModel(obj);

			var result = RestHelpers.mongoUpdate(collection, id, obj)

			if (result)
				return RestHelpers.jsonResponse(200, 'Model was updated.');

			return RestHelpers.jsonResponse(404, 'Model not found');
		}
	},

	apiDelete: function(collection, opts) {
		return function(id) {
			if (opts && opts.check) {
				if (!opts.check(this, id))
					return RestHelpers.jsonResponse(401, 'Access denied.');
			}

			var result = RestHelpers.mongoDelete(collection, id);
			if (result)
				return RestHelpers.jsonResponse(200, 'Model was deleted.');

			return RestHelpers.jsonResponse(404, 'Model not found.');
		}
	}
};