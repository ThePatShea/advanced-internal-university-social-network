Template.bubbleItem.helpers({
  ownPost: function() {
    if(Meteor.user()){
      var user = Meteor.users.findOne({_id: Meteor.user()._id});
      if(user.username == "admin"){
        return true;
      }else{
        return this.userId == Meteor.userId();
      }
    }
  }
});