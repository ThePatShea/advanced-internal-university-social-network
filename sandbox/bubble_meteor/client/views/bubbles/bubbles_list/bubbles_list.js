Template.bubblesList.helpers({
	getBubbles: function(){
		return Bubbles.find({}, {sort:{submitted: -1}, limit: mainBubblesHandle.limit()});
	}
});

Template.bubblesList.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
    	if(Meteor.Router._page == "bubblesList"){
    		this.mainBubblesHandle.loadNextPage();
    	}
    }
  });
}