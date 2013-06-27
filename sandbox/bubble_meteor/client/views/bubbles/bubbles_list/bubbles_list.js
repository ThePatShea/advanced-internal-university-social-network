Template.bubblesList.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
    	if(Meteor.Router._page == "bubblesList"){
    		this.mainBubblesHandle.loadNextPage();
    	}
    }
  });
}