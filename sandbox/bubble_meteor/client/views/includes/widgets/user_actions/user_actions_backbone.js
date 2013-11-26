Template.userActionsBackbone.helpers({
  getAdminStatus: function() {
    var bubble = Session.get('bubbleInfo');
    return BubbleDataNew.Helpers.isAdmin(bubble, this.id);
  },

  getMemberStatus: function() {
    var bubble = Session.get('bubbleInfo');
    return BubbleDataNew.Helpers.isMember(bubble, this.id);
  },

  isSuperBubble: function() {
    var bubble = Session.get('bubbleInfo');
    if (bubble)
      return bubble.bubbleType === 'super';
  }
});

Template.userActionsBackbone.events({
  'click .remove-admin': function(event) {
    // Disable the parent button
    event.stopPropagation();

    if (typeof this.id == 'undefined'){
      this.id = this._id;
    }

    if (confirm('Are you sure you want to leave this bubble?')) {
      var that = this;
      var bubble = Session.get('bubbleInfo');
      var admins = _.without(bubble.users.admins, this.id);

      if (!admins.length) {
        var members = bubble.users.members;
        if (members.length > 0) {
          // There are no admins left, but we have few members
          if (confirm('If you remove yourself, the earliest member of the bubble will be promoted to admin.  Are you sure you want to remove yourself from this bubble?')) {
            admins.push(members[0]);
            members.splice(0, 1);

            var updatedBubble = {
              'users.admins': admins,
              'users.members': members
            };

            LoadingHelper.start();
            BubbleDataNew.Helpers.updateBubble(bubble.id, updatedBubble, function() {
              LoadingHelper.stop();
              SidebarHelper.resetBubbleList();
              Meteor.Router.to('/settings/userprofile/' + that.id);
            });
          }
        } else {
          // No admins and no members, maybe delete
          if (confirm('You are the last remaining member.  Removing yourself will delete this bubble.  Are you sure you want to delete this bubble?')) {
            // Mark all updates as read
            var updates = Updates.find({bubbleId: bubble.id}, {read:false}).fetch();
            _.each(updates, function(update){
              Updates.update({_id: update._id}, { read:true});
            });

            //DOESN'T COMPLETELY REMOVE THE BUBBLE!!! NEEDS TO BE RE-EVALUATED!!!
            Meteor.call('deleteBubble', currentBubbleId);

            SidebarHelper.resetBubbleList();
            Meteor.Router.to('dashboard');
          }
        }
      } else {
        var updatedBubble = {
          'users.admins': admins
        };

        LoadingHelper.start();
        BubbleDataNew.Helpers.updateBubble(bubble.id, updatedBubble, function() {
          LoadingHelper.stop();

          SidebarHelper.resetBubbleList();
          Meteor.Router.to('dashboard');
        });
      }
    }
  },

  // TODO: Rewrite this function
  'click .remove-member': function(event) {
    event.stopPropagation();
    var that = this;

    if (confirm('Are you sure you want to leave this bubble?')) {
      var bubbleInfo = Session.get('bubbleInfo');
      var updatedBubble = {
        'users.members': _.without(bubbleInfo.users.members, this.id)
      };

      LoadingHelper.start();
      BubbleDataNew.Helpers.updateBubble(bubbleInfo.id, updatedBubble, function(error) {
        LoadingHelper.stop();

        if (!error) {
          if (that.id !== Meteor.userId()) {
            //Create update for member who is removed from bubble
            createRemoveMemberUpdate(that.id);
          }
        }

        SidebarHelper.resetBubbleList();
        Meteor.Router.to('dashboard');
      });
    }
  }
});
