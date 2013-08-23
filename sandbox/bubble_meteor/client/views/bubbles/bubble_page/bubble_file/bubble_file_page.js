var currentUrl  =  window.location.pathname;
var urlArray    =  currentUrl.split("/");
var currentBubbleId  =  urlArray[2];
filesHandle = Meteor.subscribeWithPagination('files', currentBubbleId, 10);


Template.bubbleFilePage.helpers({
  //Get posts assigned to this bubble
  getFilePosts: function(){
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    return Posts.find({bubbleId: currentBubbleId, postType:'file'}, {limit: filesHandle.limit(), sort: {lastDownloadTime: -1} });
  }
});


Template.bubbleFilePage.rendered = function(){
  $("#main").scroll(function(){
    if ( ($("#main").scrollTop() >= $("#main")[0].scrollHeight - $("#main").height()) ) {
      filesHandle.loadNextPage();
    }
  });
}
