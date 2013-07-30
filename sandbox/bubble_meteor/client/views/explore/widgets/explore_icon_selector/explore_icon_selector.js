Template.exploreIconSelector.helpers({
  checkSelected: function(category) {
    if(Meteor.Router.page() != 'bubbleSubmit') {
      var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
      if(bubble) {
        if (category == bubble.category) {
          return 'selected';
        }
      }
    }
    return false;
  },
  getCategories: function() {
    return exploreProfileIcons;
  }
});
