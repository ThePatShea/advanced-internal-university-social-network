// Generic CRUD helpers
function parseApiOptions(ctx) {
	return {
		fields: RestHelpers.getFieldList(ctx.request.query.fields),
		sort: ctx.request.query.sort,
		page: ctx.request.query.page || 0,
		limit: ctx.request.query.limit
	};
}

// Endpoints
Meteor.startup(function() {
	// Posts
	RestCrud.makeGenericApi('/api/v1_0/posts', Posts, {
		query: {
			name: 'posts',
			apiOpts: parseApiOptions,
			query: RestSecurity.filterBubblePosts
		},
		queryOne: {
			apiOpts: parseApiOptions,
			check: RestSecurity.notBubbleCheck
		},
		create: {
			check: RestSecurity.notBubbleCheck
		},
		update: {
			check: RestSecurity.notBubbleCheck
		},
		remove: {
			check: RestSecurity.notBubbleCheck
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
		},
		create: {
			check: RestSecurity.isUniqueExplore,
			preprocess: RestPost.createExplore
		},
		update: {
			check: RestSecurity.ownsExplore
		},
		remove: {
			check: RestSecurity.isExploreAdmin
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/explores/:parentId/posts', Posts, 'exploreId', {
		query: {
			name: 'posts',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		},
		create: {
			check: RestSecurity.canMakePost('exploreId')
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
		},
		create: {
			check: RestSecurity.isUniqueBubble,
			preprocess: RestPost.createBubble
		},
		update: {
			check: RestSecurity.isConnectedToBubble
		},
		remove: {
			check: RestSecurity.ownsBubble
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/posts', Posts, 'bubbleId', {
		query: {
			name: 'posts',
			apiOpts: parseApiOptions
		},
		queryOne: {
			apiOpts: parseApiOptions
		},
		create: {
			check: RestSecurity.canMakePost('bubbleId'),
			preprocess: RestPost.createPost,
			afterInsert: RestPost.processPost
		},
		update: {
			check: RestSecurity.ownsPost
		},
		remove: {
			check: RestSecurity.ownsPost
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/events', Posts, 'bubbleId', {
		query: {
			name: 'events',
			apiOpts: parseApiOptions,
			query: RestSecurity.makeBubblePostFilter('event')
		},
		queryOne: {
			apiOpts: parseApiOptions,
			check: RestSecurity.makeBubblePostCheck('event')
		},
		create: {
			check: RestSecurity.makeBubblePostCheck('event')
		},
		update: {
			check: RestSecurity.makeBubblePostCheck('event')
		},
		remove: {
			check: RestSecurity.makeBubblePostCheck('event')
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/discussions', Posts, 'bubbleId', {
		query: {
			name: 'discussions',
			apiOpts: parseApiOptions,
			query: RestSecurity.makeBubblePostFilter('discussion')
		},
		queryOne: {
			apiOpts: parseApiOptions,
			check: RestSecurity.makeBubblePostCheck('discussion')
		},
		create: {
			check: RestSecurity.makeBubblePostCheck('discussion')
		},
		update: {
			check: RestSecurity.makeBubblePostCheck('discussion')
		},
		remove: {
			check: RestSecurity.makeBubblePostCheck('discussion')
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/files', Posts, 'bubbleId', {
		query: {
			name: 'files',
			apiOpts: parseApiOptions,
			query: RestSecurity.makeBubblePostFilter('file')
		},
		queryOne: {
			apiOpts: parseApiOptions,
			check: RestSecurity.makeBubblePostCheck('file')
		},
		create: {
			check: RestSecurity.makeBubblePostCheck('file')
		},
		update: {
			check: RestSecurity.makeBubblePostCheck('file')
		},
		remove: {
			check: RestSecurity.makeBubblePostCheck('file')
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
		},
		create: {
			check: RestSecurity.canCreateComment,
			preprocess: RestPost.preComment,
			afterInsert: RestPost.postComment
		},
		update: {
			check: RestSecurity.canChangeComment
		},
		remove: {
			check: RestSecurity.canChangeComment
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
