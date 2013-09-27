// Generic CRUD helpers
function parseApiOptions(ctx) {
	return {
		fields: RestHelpers.getFieldList(ctx.request.query.fields),
		sort: ctx.request.query.sort,
		page: ctx.request.query.page || 0,
		limit: ctx.request.query.limit
	};
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
	RestCrud.makeGenericApi('/api/v1_0/posts', Posts, {
		query: {
			name: 'posts',
			apiOpts: parseApiOptions,
			query: postsFilterBubbles
		},
		queryOne: {
			apiOpts: parseApiOptions,
			check: postsSecurityCheck
		},
		create: {
			check: postsSecurityCheck
		},
		update: {
			check: postsSecurityCheck
		},
		remove: {
			check: postsDeleteCheck
		}
	});

	// Explores
	RestCrud.makeGenericApi('/api/v1_0/explores', Explores, {
		query: {
			name: 'explores',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/explores/:parentId/posts', Posts, 'exploreId', {
		query: {
			name: 'posts',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});

	// Bubbles
	RestCrud.makeGenericApi('/api/v1_0/bubbles', Bubbles, {
		query: {
			name: 'bubbles',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/posts', Posts, 'bubbleId', {
		query: {
			name: 'posts',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});

	// Comments
	RestCrud.makeGenericApi('/api/v1_0/comments', Comments, {
		query: {
			name: 'comments',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});

	// Updates
	RestCrud.makeGenericApi('/api/v1_0/updates', Updates, {
		query: {
			name: 'updates',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});

	// Users
	RestCrud.makeGenericApi('/api/v1_0/users', Meteor.users, {
		query: {
			name: 'users',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});

	// Userlogs
	RestCrud.makeGenericApi('/api/v1_0/userlogs', Userlogs, {
		query: {
			name: 'userlogs',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		}
	});
});
