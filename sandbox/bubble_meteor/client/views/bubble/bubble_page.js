Template.bubblePage.helpers({
  currentBubble: function() {
    return Bubbles.findOne(Session.get('currentBubbleId'));
  }
});