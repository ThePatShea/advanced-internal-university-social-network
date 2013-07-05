Template.bubbleInvitation.helpers({
  findUsers: function() {
    var users = this.users;
    var rejectList = [];
    rejectList = rejectList.concat(users.invitees)
                  .concat(Session.get('inviteeList'+Session.get('currentBubbleId')))
                  .concat(users.admins)
                  .concat(users.members)
                  .concat(users.invitees)
                  .concat(users.applicants)    

    rejectList.push(Meteor.userId());

    //The regular expression is used here again to prevent showing 
    //users who are removed from bubble but still exists in the local db
    return Meteor.users.find(
      {
        _id: {$nin: rejectList}, 
        username: new RegExp(Session.get('selectedUsername'),'i')
      }, {limit: 5});
  },
  getInvitees: function() {
    return this.users.invitees;
  },
  potentialInvitees: function() {
    return Session.get('inviteeList'+Session.get('currentBubbleId'));
  },
  hasSearchText: function() {
    return Session.get('selectedUsername');
  }
});

Template.bubbleInvitation.events({

  'click .shortlist-invitee': function(event){
    event.preventDefault();
    var usernameList = Session.get('inviteeList'+Session.get('currentBubbleId'));
    if(!usernameList){
      usernameList = [];
    }
    if(!_.contains(usernameList, this.username)) {
      usernameList.push(this.username);
    }
    Session.set('inviteeList'+Session.get('currentBubbleId'),usernameList);
  },
  'click .remove-invitee': function(event){
    event.preventDefault();
    var username = this.toString();
    var usernameList = Session.get('inviteeList'+Session.get('currentBubbleId'));
    usernameList = _.reject(usernameList, function(name) {
      return name == username;
    });
    Session.set('inviteeList'+Session.get('currentBubbleId'),usernameList);
  },
  'click .add-users': function(event){
    event.preventDefault();

    //convert usernameList into userIdList
    usernameList = Session.get('inviteeList'+Session.get('currentBubbleId'));
    userIdList = [];
    _.each(usernameList, function(username) {
      userIdList.push(Meteor.users.findOne({username:username})._id);
    });

    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    if(bubble.bubbleType == 'super') {
      Bubbles.update({_id:bubble._id},
      {
        $addToSet: {'users.members': {$each: userIdList}}
      });
    }else{   
      //Add Invitees to the bubble object
      Meteor.call('addInvitee', Session.get('currentBubbleId'), userIdList);
    }

    //Create notifications
    createInvitationUpdate(userIdList);
    
    //Reset Session objects
    Session.set('selectedUsername',undefined);
    Session.set('inviteeList'+Session.get('currentBubbleId'),undefined);
    Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
  }
});

Template.bubbleInvitation.rendered = function() {

  $(".search-text").bind("propertychange keyup input paste", function (event) {
    var searchText = $(".search-text").val();
    if (searchText == ""){
      Session.set('selectedUsername',undefined);
    }else{
      Session.set('selectedUsername', searchText);
    }
  });
}
