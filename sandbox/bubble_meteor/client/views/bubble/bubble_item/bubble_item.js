Template.bubbleItem.helpers({
  ownBubble: function() {
    if(Meteor.user()){
      var user = Meteor.users.findOne({_id: Meteor.user()._id});
      if(user.username == "admin"){
        return true;
      }else{
        return this.userId == Meteor.userId();
      }
    }
  },

  
});

Template.bubbleItem.events({
  'click .addPost': function(){
    Session.set('currentBubbleId', this._id);
  }
});