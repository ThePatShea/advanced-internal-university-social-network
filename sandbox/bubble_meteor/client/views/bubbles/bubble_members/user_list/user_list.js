// Helpers
Template.userList.helpers({
	hasUsers: function() {
		if (this.collection)
			return this.getCount() > 0;

		return false;
	},
	loading: function() {
		return Session.get('isLoading');
	},
	header: function() {
		return this.name;
	},
	users: function() {
		if (this.collection)
			return this.getJSON();

		return [];
	},
	pagination: function() {
		if (this.getNumPages)
			return this.getNumPages() > 1;

		return false;
	},
	isActivePage: function(type) {
		if (this.collection) {
			if (this.getCurrentPage() + 1 === this.page)
				return 'active';
		}

		return '';
	},
	pages: function() {
		if (this.collection) {
			var retVal = [];
			var currentPage = this.getCurrentPage();
			var numPages = this.getNumPages();

			for (var i = 0; i < this.getNumPages(); i++) {
				retVal.push({
					page: i + 1,
					currentPage: currentPage,
					numPages: numPages
				});
			}

			return retVal;
		}

		return [];
	},
	showAll: function() {
		if (this.collection)
			return this.getNumPages() < 6;

		return false;
	},
	show: function() {
		return (this.page >= this.currentPage && this.page <= this.currentPage + 2) || (this.page === this.numPages);
	},
	elipses: function() {
		return this.page === 2 || this.page === this.numPages - 1;
	}
});

// Events
Template.userList.events({
	'click .pageitem': function(e) {
		if (this.collection) {
			var page = parseInt($(e.target).data('page'));
			console.log(page);

			Session.set('isLoading', true);
			this.fetchPage(page - 1, function() {
				Session.set('isLoading', false);
			});
		}
	},
	'click .prev': function() {
		if(this.getCurrentPage > 0)
		{
			Session.set("isLoading", true);
			this.fetchPrevPage(function(res){
				Session.set("isLoading", false);
				console.log("CALLED", res);
			});
		}
	},
	'click .next': function() {
		if(this.getCurrentPage < this.getNumPages()-1)
		{
			Session.set("isLoading", true);
			this.fetchNextPage(function(res){
				Session.set("isLoading", false);
				console.log("CALLED", res);
			});
		}
	}
});

Template.userList.created = function(){
};

Template.userList.rendered = function(){
	console.log("THIS CURRENT PAGE: ", this.data.getCurrentPage())
};
