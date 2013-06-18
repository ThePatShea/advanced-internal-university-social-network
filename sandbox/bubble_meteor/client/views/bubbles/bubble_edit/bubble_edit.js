Template.bubbleEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentBubbleId = Session.get('currentBubbleId');
    
    var bubbleProperties = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      category: $(e.target).find('[name=category]').val(),
      lastUpdated: new Date().getTime()
    }
    
    Bubbles.update(currentBubbleId, {$set: bubbleProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        createBubbleEditUpdate(Bubbles.findOne(currentBubbleId));
        Meteor.Router.to('bubblePage', currentBubbleId);
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this bubble?")) {
      var currentBubbleId = Session.get('currentBubbleId');
      Bubbles.remove(currentBubbleId);
      Meteor.Router.to('bubblesList');
    }
  }
});

Template.bubbleEdit.helpers({
  isSelected: function(category) {
    if (category == this.category){
      return true;
    }
  },
  notSelected: function(cateogry) {
    if (cateogry != this.category){
      return true;
    }
  }
});
