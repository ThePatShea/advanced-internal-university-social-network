// Endpoints
Meteor.startup(function() {
	// Posts
	RestCrud.makeGenericApi('/api/v1_0/posts', Posts, {
		query: {
			name: 'posts',
			// TODO: Fix me, should not allow reading posts from bubbles and explores
			//query: RestSecurity.filterBubblePosts
		},
		queryOne: {
			// TODO: Fix me, should not allow reading posts from bubbles and explores
			//check: RestSecurity.notBubbleCheck
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
			queryOpts: RestQuery.noLimit
		},
		queryOne: {
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
			query: RestQuery.explorePostsFilter,
			queryOpts: RestQuery.explorePostsOrder
		},
		queryOne: {
		},
		create: {
			check: RestSecurity.canMakePost('exploreId')
		}
	});

	// Bubbles
	RestCrud.makeGenericApi('/api/v1_0/bubbles', Bubbles, {
		query: {
			name: 'bubbles',
			queryOpts: RestQuery.noLimit
		},
		queryOne: {
		},
		create: {
			//check: RestSecurity.isUniqueBubble,
			check: RestSecurity.deny,
			preprocess: RestPost.createBubble
		},
		update: {
			check: RestSecurity.ownsBubble,
		},
		patch: {
			check: RestSecurity.canUpdateBubble,
		},
		remove: {
			check: RestSecurity.ownsBubble
		}
	});

	RestRelatedCrud.makeGenericApi('/api/v1_0/bubbles/:parentId/posts', Bubbles, Posts, 'bubbleId', {
		query: {
			name: 'posts',
		},
		queryOne: {
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
			query: RestQuery.bubbleEventFilter,
			queryOpts: RestQuery.bubbleEventOrder
		},
		queryOne: {
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
			query: RestQuery.buildBubblePostFilter('discussion'),
			queryOpts: RestQuery.bubbleDiscussionOrder,
		},
		queryOne: {
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
			query: RestQuery.buildBubblePostFilter('file'),
			queryOpts: RestQuery.bubbleFileOrder
		},
		queryOne: {
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
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('members'),
			queryOpts: RestQuery.userFieldFilter
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
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('admins'),
			queryOpts: RestQuery.userFieldFilter
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
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('applicants'),
			queryOpts: RestQuery.userFieldFilter
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
			check: RestSecurity.relatedBubbleExists,
			query: RestQuery.buildBubbleUserQuery('invitees'),
			queryOpts: RestQuery.userFieldFilter
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
		},
		queryOne: {
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
		},
		queryOne: {
		}
	});

	// Users
	RestCrud.makeGenericApi('/api/v1_0/users', Meteor.users, {
		query: {
			name: 'users',
			queryOpts: RestQuery.userFieldFilter
		},
		queryOne: {
			queryOpts: RestQuery.userFieldFilter
		},
		update: {
			check: RestSecurity.deny
		},
		remove: {
			check: RestSecurity.deny
		}
	});

	RestCrud.makeGenericApi('/api/v1_0/users/:parentId/bubbles', Bubbles, {
		query: {
			name: 'bubbles',
			check: RestSecurity.relatedUserExists,
			query: RestQuery.userBubbleQuery,
			queryOpts: RestQuery.bubbleUserOrder
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
		},
		queryOne: {
		}
	});

	// File upload
	RestCrud.makeGenericApi('/api/v1_0/file', Files, {
		query: {
			check: RestSecurity.deny
		},
		queryOne: {
			queryOpts: RestQuery.fileFieldFilter
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
