Template.bubbleInvitation.helpers({
  findUsers: function() {
    var users = this.users;
    var rejectList = [];
    //Convert username list -> userId list
    inviteeIdList = _.map(Session.get('inviteeList'+Session.get('currentBubbleId')), function(username){
      if(Meteor.users.findOne({username:username})) {
        return Meteor.users.findOne({username:username})._id;
      }
    });
    rejectList = rejectList.concat(users.invitees, inviteeIdList, users.admins, users.members, users.invitees, users.applicants); 

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
  },
  inIfSearching: function() {
    if ( Session.get('currentlySearching') )
      return 'in';
    else
      return '';
  },

  returnFalse: function() {
    return false;
  },

  getProfilePicture: function(){
    var user = Meteor.users.findOne({_id:Session.get(this._id)});
    return user.profilePicture;
  },

  getNumSelected: function(){
    if(Session.get('inviteeList'+Session.get('currentBubbleId')))
      return Session.get('inviteeList'+Session.get('currentBubbleId')).length;
    else
      return 0;
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

    Session.set('currentlySearching', undefined);  // Keeps the add-members form collapsed

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
    if(this.bubbleType == 'super') {
      _.each(userIdList, function(userId) {
        createNewMemberUpdate(userId);
      });
    }else{
      createInvitationUpdate(userIdList);
    }
    
    //Reset Session objects
    Session.set('selectedUsername',undefined);
    Session.set('inviteeList'+Session.get('currentBubbleId'),[]);
    Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
  }
});

Template.bubbleInvitation.rendered = function() {

  $(".search-text").bind("propertychange keyup input paste", function (event) {
    Session.set('currentlySearching', 'true');  // Keeps the add-members form open, not collapsed

    var searchText = $(".search-text").val();
    if (searchText == ""){
      Session.set('selectedUsername',undefined);
    }else{
      Session.set('selectedUsername', searchText);
    }
  });
}
