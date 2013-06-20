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
    // console.log(searchedUsersHandle.limit);
    return Meteor.users.find({$and: [{_id: {$nin: rejectList}}, 
      {username: new RegExp(Session.get('selectedUsername'),'i')}]},{limit: searchedUsersHandle.limit()});
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
  usersReady: function(){
    return ! searchedUsersHandle.loading();
  },
  allUsersLoaded: function() {
    return ! searchedUsersHandle.loading() && 
      Meteor.users.find().count() < searchedUsersHandle.loaded();
  }
});

Template.bubbleInvitation.events({

  'click .shortlist-invitee': function(event){
    event.preventDefault();
    var list = Session.get('inviteeList'+Session.get('currentBubbleId'));
    if(!list){
      list = [];
    }
    list.push(this._id);
    Session.set('inviteeList'+Session.get('currentBubbleId'),list);
  },
  'click .remove-invitee': function(event){
    event.preventDefault();
    var userId = this.toString();
    var list = Session.get('inviteeList'+Session.get('currentBubbleId'));
    list = _.reject(list, function(inviteeId) {
      return inviteeId == userId;
    });
    Session.set('inviteeList'+Session.get('currentBubbleId'),list);
  },
  'click .add-invitees': function(event){
    event.preventDefault();

    Meteor.call('addInvitee', Session.get('currentBubbleId'), Session.get('inviteeList'+Session.get('currentBubbleId')));
    Session.set('selectedUsername',undefined);
    Session.set('inviteeList'+Session.get('currentBubbleId'),undefined);
  },
  'click .load': function(e) {
    e.preventDefault();
    searchedUsersHandle.loadNextPage();
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
