// Internal helpers
function makeParentLoaderCheck(parent, next) {
	return function(ctx, obj) {
		ctx.parentDoc = RestHelpers.mongoFindOne(parent, ctx.params.parentId);
		if (!ctx.parentDoc)
			return RestHelpers.jsonResponse(404, 'Parent was not found');

		if (next)
			return next(ctx, obj);
	};
}

function makeExtendedSecurityCheck(parent, childField, next) {
	return function(ctx, obj) {
		if (obj[childField] !== ctx.params.parentId)
			return RestHelpers.jsonResponse(404, 'Invalid parent ID');

		ctx.parentDoc = RestHelpers.mongoFindOne(parent, obj[childField]);
		if (!ctx.parentDoc)
			return RestHelpers.jsonResponse(404, 'Parent was not found');

		if (next)
			return next(ctx, obj);
	};
}

// Public API
this.RestRelatedCrud = {
	makeQuery: function(parent, child, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeParentLoaderCheck(parent, opts.check),
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

			return RestCrud.apiQuery(this, child, newOpts);
		};
	},

	makeQueryOne: function(parent, child, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeExtendedSecurityCheck(parent, childField, opts.check)
		});

		return function(parentId, id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiQueryOne(this, id, child, newOpts);
		};
	},

	makeCreate: function(parent, child, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeExtendedSecurityCheck(parent, childField, opts.check),
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

			return RestCrud.apiCreate(this, child, newOpts);
		};
	},

	makeUpdate: function(parent, child, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeExtendedSecurityCheck(parent, childField, opts.check)
		});

		return function(parentId, id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiUpdate(this, id, child, newOpts);
		};
	},

	makeDelete: function(parent, child, childField, opts) {
		opts = opts || {};

		var newOpts = RestHelpers.mergeObjects(opts, {
			check: makeExtendedSecurityCheck(parent, opts.check)
		});

		return function(parentId, id) {
			if (!RestHelpers.authUser(this, opts))
				return RestHelpers.jsonResponse(403, 'Not authenticated');

			return RestCrud.apiDelete(this, id, child, newOpts);
		};
	},

	/**
	 * Create and register related model CRUD endpoints
	 * @param  {string} baseUrl
	 * @param  {Meteor.Collection} parent parent collection
	 * @param  {Meteor.Collection} child child collection
	 * @param {string} childField child field name that links to parent
	 * @param  {object} opts
	 * @param {object} opts.query GET endpoint options
	 * @param {object} opts.create POST endpoint options
	 * @param {object} opts.queryOne GET one endpoint options
	 * @param {object} opts.update PUT endpoint options
	 * @param {object} opts.remove DELETE endpoint options
	 */
	makeGenericApi: function(baseUrl, parent, child, childField, opts) {
		Meteor.Router.add(baseUrl, 'GET', this.makeQuery(parent, child, childField, opts.query || null));
		Meteor.Router.add(baseUrl, 'POST', this.makeCreate(parent, child, childField, opts.create || null));
		Meteor.Router.add(baseUrl + '/:id', 'GET', this.makeQueryOne(parent, child, childField, opts.queryOne || null));
		Meteor.Router.add(baseUrl + '/:id', 'PUT', this.makeUpdate(parent, child, childField, opts.update || null));
		Meteor.Router.add(baseUrl + '/:id', 'DELETE', this.makeDelete(parent, child, childField, opts.remove || null));
	}
};