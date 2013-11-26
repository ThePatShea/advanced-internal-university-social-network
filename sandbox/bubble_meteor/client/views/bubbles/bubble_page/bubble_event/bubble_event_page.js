Template.bubbleEventPage.helpers({
  //Get posts assigned to this bubble
  getEventPosts: function() {
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");
    var currentBubbleId  =  urlArray[2];

    return Posts.find({bubbleId: currentBubbleId, postType: 'event', dateTime: {$gt: moment().add('hours',-4).valueOf()}}, {/*limit: eventsHandle.limit(),*/ sort: {dateTime: 1} });
  }

});


Template.bubbleEventPage.rendered = function(){
  var currentUrl  =  window.location.pathname;
  var urlArray    =  currentUrl.split("/");
  var currentBubbleId  =  urlArray[2];

  LoadingHelper.start();
  eventsHandle = Meteor.subscribe('events', currentBubbleId, function() {
    LoadingHelper.stop();
  });
};
