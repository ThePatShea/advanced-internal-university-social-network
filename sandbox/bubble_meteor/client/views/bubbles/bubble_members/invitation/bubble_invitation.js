Template.bubbleInvitation.helpers({
  findUsers: function(){
    var users = this.users;
    var rejectList = [];
    rejectList = rejectList.concat(users.invitees)
                  .concat(Session.get('inviteeList'+Session.get('currentBubbleId')))
                  .concat(users.admins)
                  .concat(users.members)
                  .concat(users.invitees)
                  .concat(users.applicants)
    rejectList.push(Meteor.userId());
    return Meteor.users.find({_id: {$nin: rejectList}});
  },
  getInvitees: function(){
    return this.users.invitees;
  },
  potentialInvitees: function(){
    return Session.get('inviteeList'+Session.get('currentBubbleId'));
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
