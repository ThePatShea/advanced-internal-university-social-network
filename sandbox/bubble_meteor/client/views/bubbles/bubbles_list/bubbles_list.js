Template.bubblesList.helpers({
	bubblesReady: function(){
		return ! bubblesHandle.loading();
	},
	allBubblesLoaded: function() {
		return ! bubblesHandle.loading() && 
			Bubbles.find().count() < bubblesHandle.loaded();
	}
});

Template.bubblesList.events({
	'click .load-more': function(event) {
    event.preventDefault();
    this.handle.loadNextPage();
  }
});


