Template.bubbleDiscussionPageBackbone.created = function(){
  Session.set("isLoading", true);
}


Template.bubbleDiscussionPageBackbone.rendered = function(){

var currentUrl  =  window.location.pathname;
var urlArray    =  currentUrl.split("/");
var currentBubbleId  =  urlArray[2];
discussionsHandle = Meteor.subscribe('discussions', currentBubbleId, function() {
    Session.set("isLoading", false);
  });
}





Template.bubbleDiscussionPageBackbone.helpers({
  //Get posts assigned to this bubble
  getDiscussionPosts: function(){
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    return Posts.find({bubbleId: currentBubbleId, postType:'discussion'}, {sort: {lastCommentTime:  -1} });   
  }
});

