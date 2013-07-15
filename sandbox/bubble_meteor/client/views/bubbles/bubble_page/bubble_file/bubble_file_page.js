Template.bubbleFilePage.helpers({
  //Get posts assigned to this bubble
  getFilePosts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}, {limit: filesHandle.limit(), sort: {lastDownloadTime: -1} });
  }
});

Template.bubbleFilePage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == "bubbleFilePage"){
        this.filesHandle.loadNextPage();
      }
    }
  });
}
