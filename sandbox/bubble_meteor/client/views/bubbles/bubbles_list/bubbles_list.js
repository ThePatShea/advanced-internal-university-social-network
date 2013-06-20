Template.bubblesList.helpers({
	bubblesReady: function(){
		return ! mainBubblesHandle.loading();
	},
	allBubblesLoaded: function() {
		return ! mainBubblesHandle.loading() && 
			Bubbles.find().count() < mainBubblesHandle.loaded();
	}
});

Template.bubblesList.events({
  'click .load-more': function(e) {
    e.preventDefault();
    mainBubblesHandle.loadNextPage();
  }
});