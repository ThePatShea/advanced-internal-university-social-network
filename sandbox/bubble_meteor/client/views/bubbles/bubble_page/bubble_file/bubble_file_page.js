Template.bubbleFilePage.helpers({
  //Get posts assigned to this bubble
  getFilePosts: function(){
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    return Posts.find({bubbleId: currentBubbleId, postType:'file'}, {/*limit: filesHandle.limit(),*/ sort: {lastDownloadTime: -1} });
  }
});


Template.bubbleFilePage.rendered = function() {
  var currentUrl  =  window.location.pathname;
  var urlArray    =  currentUrl.split("/");
  var currentBubbleId  =  urlArray[2];
  filesHandle = Meteor.subscribe('files', currentBubbleId, function() {
    Session.set("isLoading", false);
  });

  //Log clicking of add file button
  /*$(".btn-add-file").on("click", function() {
    Meteor.call('createLog', 'addFilePost', 'addFilePost');
  });*/
/*
  $("#main").scroll(function(){
    if ( ($("#main").scrollTop() >= $("#main")[0].scrollHeight - $("#main").height()) ) {
      filesHandle.loadNextPage();
    }
  });
//*/
}

Template.bubbleFilePage.created = function(){
  Session.set("isLoading", true);
}