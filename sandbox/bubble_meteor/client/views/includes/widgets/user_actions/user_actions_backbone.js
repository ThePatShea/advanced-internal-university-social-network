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
  // TODO: Completely rewrite this function - it is very insecure
  'click .remove-admin': function(event) {
    // Disable the parent button
    event.stopPropagation();
    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    if (confirm("Are you sure you want to leave this bubble?")) {
      var bubble = Session.get('bubbleInfo');
      var admins = bubble.users.admins;
      var members = bubble.users.members;
      var count = admins.length + members.length;

      var currentBubbleId = Session.get('currentBubbleId');

      if (count > 1) {
        Bubbles.update({_id:currentBubbleId},
        {
          $pull: {'users.admins': this.id}
        });

        //If no more admins are left, the earliest member will be an admin
        if(admins.length == 1){
          if(confirm('If you remove yourself, the earliest member of the bubble will be promoted to admin.  Are you sure you want to remove yourself from this bubble?'))
          {
            // TODO: URGENT: Security FIX
            Bubbles.update({_id:Session.get('currentBubbleId')},
            {
              $addToSet: {'users.admins': members[0]},
              $pull: {'users.members': members[0]}
            });
          }
        }
      } else {
        if(confirm("You are the last remaining member.  Removing yourself will delete this bubble.  Are you sure you want to delete this bubble?")) {
          var updates = Updates.find({bubbleId: currentBubbleId}, {read:false}).fetch();
          _.each(updates, function(update){
            Updates.update({_id: update._id}, {read:true});
          });
          var updateIds = _.pluck(updates, '_id');
          //var currentBubbleId = Session.get('currentBubbleId');
          var bubbleExplorePosts = Posts.find({postAsId: currentBubbleId}).fetch();
          var bubbleOwnPosts = Posts.find({bubbleId: currentBubbleId}).fetch();
          var bubblePosts = bubbleOwnPosts.concat(bubbleExplorePosts);
          var bubblePostIds = _.pluck(bubblePosts, '_id');


          /*Posts.remove({_id: {$in: bubblePostIds}});
          Updates.remove({_id: {$in: updateIds}});*/
          //Bubbles.remove({_id:currentBubbleId});

          //DOESN'T COMPLETELY REMOVE THE BUBBLE!!! NEEDS TO BE RE-EVALUATED!!!
          Meteor.call("deleteBubble",currentBubbleId);

          //Route to the next available bubble or to the search page
          /*var bubble = Bubbles.find({$or: [{'users.members': Meteor.userId()},{'users.admins': Meteor.userId()}]}, {sort: {submitted: -1}}).fetch();
          if(bubble.length > 0){
            Meteor.Router.to('/mybubbles/'+bubble[0]._id+'/home');
          }else{
            Meteor.Router.to('/mybubbles/search/bubbles');
          }*/
          Meteor.Router.to('dashboard');
        }
      }
    }
  },

  // TODO: Rewrite this function
  'click .remove-member': function(event) {
    event.stopPropagation();
    console.log("THIS USER IS: ",this);
    that = this;

    if(confirm("Are you sure you want to leave this bubble?"))
    {
      Bubbles.update({_id:Session.get('currentBubbleId')},
      {
        $pull: {'users.members': this.id}
      }, function() {
        console.log("THAT: ",that);
        if (that.id != Meteor.userId())
        {
          $('#user-actions').trigger('bubbleRefresh', 'members');
        } else {
          Meteor.Router.to('dashboard');
        }
      });
      Session.set(Session.get('currentBubbleId')+this.id,undefined);

      if (this.id != Meteor.userId()){
        //Create update for member who is removed from bubble
        createRemoveMemberUpdate(this.id);
      }
     }
  }
});
