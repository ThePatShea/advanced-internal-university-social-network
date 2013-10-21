this.RestCrud = {
	/**
	 * Run query over collection
	 * @param  {object} ctx        			request context
	 * @param  {Collection} collection 	Meteor collection
	 * @param  {object} opts       			options
	 * @param  {function} opts.apiOpts  request parsing function (page, fields, etc)
	 * @param  {function} opts.check    permission check callback
	 * @return {object}            			response
	 */
	apiQuery: function(ctx, collection, opts) {
		if (opts && opts.check) {
			var response = opts.check(ctx);
			if (response)
				return response;
		}

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

	/**
	 * Get one record
	 * @param  {object} ctx        			request context
	 * @param  {string} id         			record id
	 * @param  {Collection} collection 	Meteor collection
	 * @param  {object} opts       			options
	 * @param  {function} opts.apiOpts  request parsing function (page, fields, etc)
	 * @param  {function} opts.check    permission check callback
	 * @return {object}            			response
	 */
	apiQueryOne: function(ctx, id, collection, opts) {
		// Get API options
		var apiOptions = {};

		if (opts.apiOpts)
			apiOptions = opts.apiOpts(ctx);

		// Run query
		var obj = RestHelpers.mongoFindOne(collection, id, apiOptions.fields);
		if (!obj) {
			// TODO: Better error logging/reporting
			return RestHelpers.jsonResponse(404, 'Not found');
		}

		if (opts && opts.check) {
			var response = opts.check(ctx, obj);
			if (response)
				return response;
		}

		// Rename _id to id
		obj = RestHelpers.fromMongoModel(obj);

		return RestHelpers.jsonResponse(200, obj);
	},

	/**
	 * Create record
	 * @param  {object} ctx        			   request context
	 * @param  {Collection} collection 	   collection
	 * @param  {object} opts       		     options
	 * @param  {function} opts.check       permission check callback
	 * @param  {function} opts.preprocess  record preprocessing function, called before comitting to database
	 * @param  {function} opts.afterInsert record post-processing function, called after comitting to database
	 * @return {object}            			   response
	 */
	apiCreate: function(ctx, collection, opts) {
		// Safety checks
		var obj = ctx.request.body;

		if (obj.id) {
			// TODO: Better error logging/reporting
			return RestHelpers.jsonResponse(401, 'Cant create item with id');
		}
		obj.id = new Meteor.Collection.ObjectID().toHexString();

		if (opts && opts.check) {
			var response = opts.check(ctx, obj);
			if (response)
				return response;
		}

		obj = RestHelpers.toMongoModel(obj);

		if (opts.preprocess)
			obj = opts.preprocess(ctx, obj);

		var results = RestHelpers.mongoInsert(collection, obj);

		if (results.length == 0)
			return RestHelpers.jsonResponse(500, 'Failed to create model');

		var result = results[0];

		if (opts.afterInsert)
			opts.afterInsert(ctx, result);

		result = RestHelpers.fromMongoModel(result);

		return RestHelpers.jsonResponse(200, result);
	},

	/**
	 * Update record
	 * @param  {object} ctx        			context
	 * @param  {string} id         			record id
	 * @param  {Collection} collection 	Meteor collection
	 * @param  {object} opts       			options
	 * @param  {function} opts.check       permission check callback
	 * @param  {function} opts.preprocess  record preprocessing function, called before comitting to database
	 * @param  {function} opts.afterUpdate record post-processing function, called after comitting to database
	 * @return {object}            			response
	 */
	apiUpdate: function(ctx, id, collection, opts) {
		// Safety checks
		var obj = ctx.request.body;

		if (obj.id != id) {
			// TODO: Better error logging/reporting
			return RestHelpers.jsonResponse(401, 'Mismatched id');
		}

		if (opts.check) {
			var response = opts.check(ctx, obj);
			if (response)
				return response;
		}

		obj = RestHelpers.toMongoModel(obj);

		if (opts.preprocess)
			obj = opts.preprocess(ctx, obj);

		var result = RestHelpers.mongoUpdate(collection, id, obj)

		if (result) {
			if (opts.afterUpdate)
				opts.afterUpdate(ctx, obj);

			return RestHelpers.jsonResponse(200, 'Successfully updated');
		}

		return RestHelpers.jsonResponse(404, 'Model not found');
	},

	/**
	 * Delete record
	 * @param  {object} ctx        			request context
	 * @param  {string} id         			record id
	 * @param  {Collection} collection 	Meteor collection
	 * @param  {object} opts       			options
	 * @param  {function} opts.check       permission check callback
	 * @param  {function} opts.afterDelete record post-processing function, called after comitting to database
	 * @return {object}            			response
	 */
	apiDelete: function(ctx, id, collection, opts) {
		var obj = RestHelpers.mongoFindOne(collection, id);

		if (!obj)
			return RestHelpers.jsonResponse(404, 'Model not found');

		if (opts.check) {
			var response = opts.check(ctx, obj);
			if (response)
				return response;
		}

		var result = RestHelpers.mongoDelete(collection, id);
		if (result) {
			if (opts.afterDelete)
				opts.afterDelete(ctx, obj);

			return RestHelpers.jsonResponse(200, 'Successfully deleted');
		}

		return RestHelpers.jsonResponse(404, 'Model not found');
	},

	/**
	 * Query factory method.
	 * Accepts collection and options and returns meteor-router view function.
	 * @param  {Collection} collection Meteor collection
	 * @param  {object} opts       		 options
	 * @return {function} 	           view functions
	 */
	makeQuery: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function() {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return self.apiQuery(this, collection, opts);
		};
	},

	/**
	 * Create record factory method.
	 * Accepts collection and options and returns meteor-router view function.
	 * @param  {Collection} collection Meteor collection
	 * @param  {object} opts       		 options
	 * @return {function} 	           view functions
	 */
	makeCreate: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function() {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return self.apiCreate(this, collection, opts);
		};
	},

	/**
	 * Get one factory method.
	 * Accepts collection and options and returns meteor-router view function.
	 * @param  {Collection} collection Meteor collection
	 * @param  {object} opts       		 options
	 * @return {function} 	           view functions
	 */
	makeQueryOne: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function(id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return self.apiQueryOne(this, id, collection, opts);
		};
	},

	/**
	 * Update record factory method.
	 * Accepts collection and options and returns meteor-router view function.
	 * @param  {Collection} collection Meteor collection
	 * @param  {object} opts       		 options
	 * @return {function} 	           view functions
	 */
	makeUpdate: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function(id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return self.apiUpdate(this, id, collection, opts);
		};
	},

	/**
	 * Delete record factory method.
	 * Accepts collection and options and returns meteor-router view function.
	 * @param  {Collection} collection Meteor collection
	 * @param  {object} opts       		 options
	 * @return {function} 	           view functions
	 */
	makeDelete: function(collection, opts) {
		var self = this;
		opts = opts || {};

		return function(id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return self.apiDelete(this, id, collection, opts);
		};
	},
	/**
	 * Create and register CRUD endpoints
	 * @param {string} baseUrl
	 * @param {Meteor.Collection} collection
	 * @param {object} opts
	 * @param {object} opts.query 		GET endpoint options
	 * @param {object} opts.create 		POST endpoint options
	 * @param {object} opts.queryOne 	GET one endpoint options
	 * @param {object} opts.update 		PUT endpoint options
	 * @param {object} opts.remove 		DELETE endpoint options
	 */
	makeGenericApi: function(baseUrl, collection, opts) {
		var handler;

		handler = (opts.query && opts.query.handler) || this.makeQuery(collection, opts.query || null);
		Meteor.Router.add(baseUrl, 'GET', handler);

		handler = (opts.create && opts.create.handler) || this.makeCreate(collection, opts.create || null);
		Meteor.Router.add(baseUrl, 'POST', handler);

		handler = (opts.queryOne && opts.queryOne.handler) || this.makeQueryOne(collection, opts.queryOne || null);
		Meteor.Router.add(baseUrl + '/:id', 'GET', handler);

		handler = (opts.update && opts.update.handler) || this.makeUpdate(collection, opts.update || null);
		Meteor.Router.add(baseUrl + '/:id', 'PUT', handler);

		handler = (opts.remove && opts.remove.handler) || this.makeDelete(collection, opts.remove || null);
		Meteor.Router.add(baseUrl + '/:id', 'DELETE', handler);
	}
};