this.RestCrud = {
	apiQuery: function(ctx, collection, opts) {
		// Get API options
		var apiOptions = {};

		if (opts.apiOpts)
			apiOptions = opts.apiOpts(ctx);

		// Make query
		var queryOptions = RestHelpers.buildOptions(apiOptions);

		var query = null;
		if (opts.query)
			query = opts.query(ctx, query);

		var data = RestHelpers.mongoFind(collection, query, apiOptions.fields, queryOptions);

		// Generate result
		return RestHelpers.makeQueryResponse(apiOptions, queryOptions, data, opts);
	},

	apiQueryOne: function(ctx, id, collection, opts) {
		// Get API options
		var apiOptions = {};

		if (opts.apiOpts)
			apiOptions = opts.apiOpts(ctx);

		// Run query
		var obj = RestHelpers.mongoFindOne(collection, id, apiOptions.fields);
		if (!obj) {
			// TODO: Better error logging/reporting
			return RestHelpers.jsonResponse(404, 'Not found.');
		}

		if (opts && opts.check) {
			if (!opts.check(ctx, obj)) {
				return RestHelpers.jsonResponse(401, 'Access denied.');
			}
		}

		// Rename _id to id
		obj = RestHelpers.fromMongoModel(obj);

		return RestHelpers.jsonResponse(200, obj);
	},

	apiCreate: function(ctx, collection, opts) {
		// Safety checks
		var obj = ctx.request.body;

		if (obj.id) {
			// TODO: Better error logging/reporting
			return RestHelpers.jsonResponse(401, 'Access denied.');
		}
		obj.id = new Meteor.Collection.ObjectID().toHexString()

		if (opts && opts.check) {
			if (!opts.check(ctx, obj)) {
				// TODO: Better error logging/reporting
				return RestHelpers.jsonResponse(401, 'Access denied.');
			}
		}

		// Rename id to _id
		obj = RestHelpers.toMongoModel(obj);

		if (opts.preprocess)
			obj = opts.preprocess(ctx, obj);

		var result = RestHelpers.mongoInsert(collection, obj)
		return RestHelpers.jsonResponse(200, result);
	},

	apiUpdate: function(ctx, id, collection, opts) {
		// Safety checks
		var obj = ctx.request.body;

		if (obj.id != id) {
			// TODO: Better error logging/reporting
			return RestHelpers.jsonResponse(401, 'Access denied.');
		}

		if (opts.check) {
			if (!opts.check(ctx, obj)) {
				// TODO: Better error logging/reporting
				return RestHelpers.jsonResponse(401, 'Access denied.');
			}
		}

		obj = RestHelpers.toMongoModel(obj);

		if (opts.preprocess)
			obj = opts.preprocess(ctx, obj);

		var result = RestHelpers.mongoUpdate(collection, id, obj)

		if (result)
			return RestHelpers.jsonResponse(200, 'Model was updated.');

		return RestHelpers.jsonResponse(404, 'Model not found');
	},

	apiDelete: function(ctx, id, collection, opts) {
		var obj = RestHelpers.mongoFindOne(collection, id);

		if (!obj)
			return RestHelpers.jsonResponse(404, 'Model not found');

		if (opts.check) {
			if (!opts.check(ctx, obj))
				return RestHelpers.jsonResponse(401, 'Access denied.');
		}

		var result = RestHelpers.mongoDelete(collection, id);
		if (result)
			return RestHelpers.jsonResponse(200, 'Model was deleted.');

		return RestHelpers.jsonResponse(404, 'Model not found.');
	},

	// Handler generation functions
	makeQuery: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function() {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Access Denied.');

			return self.apiQuery(this, collection, opts);
		};
	},

	makeCreate: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function() {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Access Denied.');

			return self.apiCreate(this, collection, opts);
		};
	},

	makeQueryOne: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function(id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Access Denied.');

			return self.apiQueryOne(this, id, collection, opts);
		};
	},

	makeUpdate: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function(id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Access Denied.');

			return self.apiUpdate(this, id, collection, opts);
		};
	},

	makeDelete: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function(id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Access Denied.');

			return self.apiDelete(this, id, collection, opts);
		};
	},
	/**
	 * Create and register CRUD endpoints
	 * @param  {string} baseUrl
	 * @param  {Meteor.Collection} collection
	 * @param  {object} opts
	 * @param {object} opts.query GET endpoint options
	 * @param {object} opts.create POST endpoint options
	 * @param {object} opts.queryOne GET one endpoint options
	 * @param {object} opts.update PUT endpoint options
	 * @param {object} opts.remove DELETE endpoint options
	 */
	makeGenericApi: function(baseUrl, collection, opts) {
		Meteor.Router.add(baseUrl, 'GET', this.makeQuery(collection, opts.query || null));
		Meteor.Router.add(baseUrl, 'POST', this.makeCreate(collection, opts.create || null));
		Meteor.Router.add(baseUrl + '/:id', 'GET', this.makeQueryOne(collection, opts.queryOne || null));
		Meteor.Router.add(baseUrl + '/:id', 'PUT', this.makeUpdate(collection, opts.update || null));
		Meteor.Router.add(baseUrl + '/:id', 'DELETE', this.makeDelete(collection, opts.remove || null));
	}
};