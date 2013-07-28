Template.sidebar.helpers({
    userBubbles: function() {
      return Bubbles.find({
        $or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},
        {sort: {'users.members': -1, 'users.admins': -1, 'submitted': -1}
      });
    }
});
