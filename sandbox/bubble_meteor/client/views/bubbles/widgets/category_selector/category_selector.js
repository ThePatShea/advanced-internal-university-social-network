Template.categorySelector.helpers({
  checkSelected: function(category) {
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    if (category == bubble.category) {
      return 'selected';
    }else{
      return false;
    }
  },
  getCategories: function() {
    return categories;
  }
});
