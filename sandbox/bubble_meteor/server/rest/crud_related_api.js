// Internal helpers
function makeSecurityCheck(childField, next) {
	return function(ctx, obj) {
		if (obj[childField] !== ctx.params.parentId)
			return RestHelpers.jsonResponse(404, 'Invalid parent ID');

		if (next)
			return next(ctx, obj);
	};
}

// Public API
this.RestRelatedCrud = {
	makeQuery: function(collection, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			query: function(ctx) {
				var query = {};
				query[childField] = ctx.params.parentId;

				if (opts.query)
					return opts.query(ctx, query);

				return query;
			}
		});

		return function(parentId) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiQuery(this, collection, newOpts);
		};
	},

	makeQueryOne: function(collection, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeSecurityCheck(childField, opts.check)
		});

		return function(parentId, id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiQueryOne(this, id, collection, newOpts);
		};
	},

	makeCreate: function(collection, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			preprocess: function(ctx, obj) {
				obj[childField] = ctx.params.parentId;

				if (opts.preprocess)
					return opts.preprocess(ctx, obj);

				return obj;
			}
		});

		return function(parentId) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiCreate(this, collection, newOpts);
		};
	},

	makeUpdate: function(collection, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeSecurityCheck(childField, opts.check)
		});

		return function(parentId, id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiUpdate(this, id, collection, newOpts);
		};
	},

	makeDelete: function(collection, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeSecurityCheck(childField, opts.check)
		});

		return function(parentId, id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiDelete(this, id, collection, newOpts);
		};
	},

	/**
	 * Create and register related model CRUD endpoints
	 * @param  {string} baseUrl
	 * @param  {Meteor.Collection} collection
	 * @param {string} childField child field name that links to parent
	 * @param  {object} opts
	 * @param {object} opts.query GET endpoint options
	 * @param {object} opts.create POST endpoint options
	 * @param {object} opts.queryOne GET one endpoint options
	 * @param {object} opts.update PUT endpoint options
	 * @param {object} opts.remove DELETE endpoint options
	 */
	makeGenericApi: function(baseUrl, collection, childField, opts) {
		Meteor.Router.add(baseUrl, 'GET', this.makeQuery(collection, childField, opts.query || null));
		Meteor.Router.add(baseUrl, 'POST', this.makeCreate(collection, childField, opts.create || null));
		Meteor.Router.add(baseUrl + '/:id', 'GET', this.makeQueryOne(collection, childField, opts.queryOne || null));
		Meteor.Router.add(baseUrl + '/:id', 'PUT', this.makeUpdate(collection, childField, opts.update || null));
		Meteor.Router.add(baseUrl + '/:id', 'DELETE', this.makeDelete(collection, childField, opts.remove || null));
	}
};