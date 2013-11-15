// Generic CRUD helpers
function parseApiOptions(ctx) {
	return {
		fields: RestHelpers.getFieldList(ctx.request.query.fields),
		sort: ctx.request.query.sort,
		page: ctx.request.query.page || 0,
		limit: ctx.request.query.limit || RestConst.DEFAULT_LIMIT
	};
}

function parseBubbleUserOpts(ctx) {
	var opts = parseApiOptions(ctx);
	opts.fields = {
		createdAt: true,
		emails: true,
		name: true,
		userType: true,
		username: true,
		profilePicture: true
  };

  return opts;
}

function getFileApiOptions(ctx) {
	return {
		fields: RestHelpers.getFieldList('name,type,userId,size,url')
	};
}

// Endpoints
Meteor.startup(function() {
	// Posts
	RestCrud.makeGenericApi('/api/v1_0/posts', Posts, {
		query: {
			name: 'posts',
			apiOpts: parseApiOptions,
			// TODO: Fix me, should not allow reading posts from bubbles and explores
			//query: RestSecurity.filterBubblePosts
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
			apiOpts: RestQuery.noLimit(parseApiOptions)
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

	RestRelatedCrud.makeGenericApi('/api/v1_0/explores/:parentId/posts', Explores, Posts, 'exploreId', {
		query: {
			name: 'posts',
			apiOpts: RestQuery.explorePostsOrder(parseApiOptions),
			query: RestQuery.explorePostsFilter
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
			apiOpts: RestQuery.noLimit(parseApiOptions)
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

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/posts', Bubbles, Posts, 'bubbleId', {
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
			check: RestSecurity.canUpdatePost,
			preprocess: RestPost.updatePost,
			afterUpdate: RestPost.processPost
		},
		remove: {
			check: RestSecurity.ownsPost,
			afterDelete: RestPost.deletePost
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/events', Bubbles, Posts, 'bubbleId', {
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
			check: RestSecurity.canMakePost('bubbleId'),
			preprocess: RestPost.createPost,
			afterInsert: RestPost.processPost
		},
		update: {
			check: RestSecurity.canUpdatePost,
			preprocess: RestPost.updatePost,
			afterUpdate: RestPost.processPost
		},
		remove: {
			check: RestSecurity.makeBubblePostCheck('event')
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/discussions', Bubbles, Posts, 'bubbleId', {
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
			check: RestSecurity.canMakePost('bubbleId'),
			preprocess: RestPost.createPost,
			afterInsert: RestPost.processPost
		},
		update: {
			check: RestSecurity.canUpdatePost,
			preprocess: RestPost.updatePost,
			afterUpdate: RestPost.processPost
		},
		remove: {
			check: RestSecurity.makeBubblePostCheck('discussion')
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/files', Bubbles, Posts, 'bubbleId', {
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
			check: RestSecurity.canMakePost('bubbleId'),
			preprocess: RestPost.createPost,
			afterInsert: RestPost.processPost
		},
		update: {
			check: RestSecurity.canUpdatePost,
			preprocess: RestPost.updatePost,
			afterUpdate: RestPost.processPost
		},
		remove: {
			check: RestSecurity.makeBubblePostCheck('file')
		}
	});

	RestCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/members', Meteor.users, {
		query: {
			name: 'members',
			apiOpts: parseBubbleUserOpts,
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('members')
		},
		queryOne: {
			check: RestSecurity.deny
		},
		create: {
			check: RestSecurity.deny
		},
		update: {
			check: RestSecurity.deny
		},
		remove: {
			check: RestSecurity.deny
		}
	});

	RestCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/admins', Meteor.users, {
		query: {
			name: 'admins',
			apiOpts: parseBubbleUserOpts,
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('admins')
		},
		queryOne: {
			check: RestSecurity.deny
		},
		create: {
			check: RestSecurity.deny
		},
		update: {
			check: RestSecurity.deny
		},
		remove: {
			check: RestSecurity.deny
		}
	});

	RestCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/applicants', Meteor.users, {
		query: {
			name: 'applicants',
			apiOpts: parseBubbleUserOpts,
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('applicants')
		},
		queryOne: {
			check: RestSecurity.deny
		},
		create: {
			check: RestSecurity.deny
		},
		update: {
			check: RestSecurity.deny
		},
		remove: {
			check: RestSecurity.deny
		}
	});

	RestCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/invitees', Meteor.users, {
		query: {
			name: 'invitees',
			apiOpts: parseBubbleUserOpts,
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('invitees')
		},
		queryOne: {
			check: RestSecurity.deny
		},
		create: {
			check: RestSecurity.deny
		},
		update: {
			check: RestSecurity.deny
		},
		remove: {
			check: RestSecurity.deny
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

	RestCrud.makeGenericApi('/api/v1_0/users/:parentId/bubbles', Bubbles, {
		query: {
			name: 'bubbles',
			apiOpts: RestQuery.bubbleUserOrder(parseApiOptions),
			check: RestSecurity.relatedUserExists,
			query: RestQuery.buildUserBubbleQuery()
		},
		queryOne: {
			check: RestSecurity.deny
		},
		create: {
			check: RestSecurity.deny
		},
		update: {
			check: RestSecurity.deny
		},
		remove: {
			check: RestSecurity.deny
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

	// File upload
	RestCrud.makeGenericApi('/api/v1_0/file', Files, {
		query: {
			check: RestSecurity.deny
		},
		queryOne: {
			apiOpts: getFileApiOptions
		},
		create: {
			handler: RestHandlers.handleFileUpload
		},
		update: {
			check: RestSecurity.canChangeFile,
			preprocess: RestPost.preFile
		},
		remove: {
			check: RestSecurity.canChangeFile
		}
	});

	Meteor.Router.add('/api/v1_0/file/:id/get', 'GET', RestHandlers.handleFileRequest);

	// CORS file uploading
	Meteor.Router.add('/api/v1_0/file', 'OPTIONS', RestHandlers.handleCorsRequest);
});
