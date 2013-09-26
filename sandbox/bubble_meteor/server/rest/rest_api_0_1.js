var DEFAULT_LIMIT = 10

// Generic CRUD helpers
function apiQuery(collection, opts) {
	return function() {
		var fields = RestHelpers.getFieldList(this.request.query.fields);
		var sort = this.request.query.sort;
		var page = this.request.query.page || 0;
		var limit = this.request.query.limit || DEFAULT_LIMIT;
		var name = (opts && opts.name) || 'items';

		// Make query
		var options = RestHelpers.buildOptions(sort, page, limit);
		var data = RestHelpers.mongoFind(collection, null, fields, options);

		var query = null;
		if (opts && opts.queryFn)
			query = opts.queryFn(this);

		// Generate result
		var result = {
			count: data.count,
			pages: Math.floor(data.count / limit) + ((data.count % limit > 0) ? 1 : 0),
			page: page
		};
		result[name] = data.items;

		return [200, JSON.stringify(result)];
	};
}

function apiQueryOne(collection, opts) {
	return function(id) {
		var fields = RestHelpers.getFieldList(this.request.query.fields);

		var obj = RestHelpers.mongoFindOne(collection, id, fields);
		if (!obj) {
			// TODO: Better error logging/reporting
			return [404, JSON.stringify('Not found.')];
		}

		if (opts && opts.check) {
			if (!opts.check(obj)) {
				return [401, 'Access denied.'];
			}
		}

		return [200, JSON.stringify(obj)];
	};
}

function apiCreate(collection, opts) {
	return function() {
		// Safety checks
		var obj = this.request.body;

		if (obj._id) {
			// TODO: Better error logging/reporting
			return [401, 'Access denied.']
		}
		obj._id = new Meteor.Collection.ObjectID().toHexString()

		if (opts && opts.check) {
			if (!opts.check(this, obj)) {
				// TODO: Better error logging/reporting
				return [401, 'Access denied.'];
			}
		}

		var result = RestHelpers.mongoInsert(collection, obj)
		return [200, JSON.stringify(result)];
	};
}

function apiUpdate(collection, opts) {
	return function(id) {
		// Safety checks
		var obj = this.request.body;

		if (obj._id != id) {
			// TODO: Better error logging/reporting
			return [401, 'Access denied.'];
		}

		if (opts && opts.check) {
			if (!opts.check(this, obj)) {
				// TODO: Better error logging/reporting
				return [401, 'Access denied.'];
			}
		}

		var result = RestHelpers.mongoUpdate(collection, id, obj)

		if (result)
			return [200];

		return [404];
	};
}

function apiDelete(collection, opts) {
	return function(id) {
		if (opts && opts.check) {
			if (!opts.check(this, id))
				return [401, 'Access denied.'];
		}

		var result = RestHelpers.mongoDelete(collection, id);
		if (result)
			return [200];

		return [404];
	}
}

// Security related stuff
function postsFilterBubbles(ctx) {
	return {
		bubbleId: {$exists: false}
	};
}

function postsSecurityCheck(ctx, obj) {
	if (obj && obj.bubbleId)
		return false;

	return true;
}

function postsDeleteCheck(ctx, id) {
	var obj = RestHelpers.mongoFindOne(Posts, id);
	return postsSecurityCheck(ctx, obj);
}

// Endpoints
Meteor.startup(function() {
	// Posts
	Meteor.Router.add('/api/v1_0/posts', 'GET', apiQuery(Posts, {
		name: 'posts',
		queryFn: postsFilterBubbles
	}));

	Meteor.Router.add('/api/v1_0/posts', 'POST', apiCreate(Posts, {
		check: postsSecurityCheck
	}));

	Meteor.Router.add('/api/v1_0/posts/:id', 'GET', apiQueryOne(Posts, {
		check: postsSecurityCheck
	}));

	Meteor.Router.add('/api/v1_0/posts/:id', 'PUT', apiUpdate(Posts, {
		check: postsSecurityCheck
	}));

	Meteor.Router.add('/api/v1_0/posts/:id', 'DELETE', apiDelete(Posts, {
		check: postsDeleteCheck
	}));
});
