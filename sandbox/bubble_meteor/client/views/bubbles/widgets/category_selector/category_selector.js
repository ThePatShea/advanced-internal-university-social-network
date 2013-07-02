Template.categorySelector.helpers({
  checkSelected: function(category) {
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    if(bubble) {
      if (category == bubble.category) {
        return 'selected';
      }
    }
    return false;
  },
  getCategories: function() {
    return categories;
  }
});
