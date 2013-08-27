/*
var currentUrl  =  window.location.pathname;
var urlArray    =  currentUrl.split("/");
var currentBubbleId  =  urlArray[2];
discussionsHandle = Meteor.subscribeWithPagination('discussions', currentBubbleId, 10);
*/
Template.bubbleDiscussionPage.helpers({
  //Get posts assigned to this bubble
  getDiscussionPosts: function(){
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    return Posts.find({bubbleId: currentBubbleId, postType:'discussion'}, {sort: {lastCommentTime:  -1} });   
  }
});

Template.bubbleDiscussionPage.rendered = function(){

var currentUrl  =  window.location.pathname;
var urlArray    =  currentUrl.split("/");
var currentBubbleId  =  urlArray[2];
discussionsHandle = Meteor.subscribe('discussions', currentBubbleId);


/*
  $("#main").scroll(function(){
    if ( ($("#main").scrollTop() >= $("#main")[0].scrollHeight - $("#main").height()) ) {
      discussionsHandle.loadNextPage();
    }
   });
//*/
}
