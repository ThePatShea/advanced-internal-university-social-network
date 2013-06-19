Template.bubbleInvitation.helpers({
  findUsers: function(){
    var users = this.users;
    var rejectList = [];
    rejectList = rejectList.concat(users.invitees);
    rejectList = rejectList.concat(Session.get('inviteeList'+Session.get('currentBubbleId')));
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
  'submit form': function(e) {
    e.preventDefault();
    //store the content into the session
		Session.set('selectedUsername', $(e.target).find('[name=title]').val()); 
    Session.set('currentUserId', Meteor.userId());
  },
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

  //Format the searchfield when the textbox is changed
  $(".search-text").change(function(){
    var searchText = $(".search-text").val();
    Session.set('selectedUsername', searchText);
  });

}
