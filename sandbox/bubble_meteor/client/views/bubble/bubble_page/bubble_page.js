Template.bubblePage.helpers({
  currentBubble: function() {
    return Bubbles.findOne(Session.get('currentBubbleId'));
  },
  posts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId')});
  }
});