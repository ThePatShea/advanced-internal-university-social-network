// Generic CRUD helpers
function parseApiOptions(ctx) {
	return {
		fields: RestHelpers.getFieldList(ctx.request.query.fields),
		sort: ctx.request.query.sort,
		page: ctx.request.query.page || 0,
		limit: ctx.request.query.limit
	};
}

// Related management

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
	Meteor.Router.add('/api/v1_0/posts', 'GET', RestCrud.apiQuery(Posts, {
		name: 'posts',
		apiOptsFn: parseApiOptions,
		queryFn: postsFilterBubbles,
	}));

	Meteor.Router.add('/api/v1_0/posts', 'POST', RestCrud.apiCreate(Posts, {
		check: postsSecurityCheck
	}));

	Meteor.Router.add('/api/v1_0/posts/:id', 'GET', RestCrud.apiQueryOne(Posts, {
		check: postsSecurityCheck
	}));

	Meteor.Router.add('/api/v1_0/posts/:id', 'PUT', RestCrud.apiUpdate(Posts, {
		check: postsSecurityCheck
	}));

	Meteor.Router.add('/api/v1_0/posts/:id', 'DELETE', RestCrud.apiDelete(Posts, {
		check: postsDeleteCheck
	}));
});
