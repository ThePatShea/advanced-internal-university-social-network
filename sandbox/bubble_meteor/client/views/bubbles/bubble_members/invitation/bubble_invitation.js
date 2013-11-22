Template.bubbleInvitation.events({

  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if(!DisplayHelpers.isMobile()) {
      SearchHelpers.searchUsersREST(searchText, function(err, res) {
        if (!err)
          Session.set('searchRes', res);
      });
    }
    LoadingHelper.stop();
  },

  'click .shortlist-invitee': function(event){
    event.preventDefault();

    var that = this;

    if (!(isApplicant(that.id) || isInvitee(that.id) || isShortlisted(that.id)))
      addToShortlist(that);
  },

  'click .remove-invitee': function(evt){
    event.preventDefault();

    var that = this;
    var shortList = Session.get('shortList') || [];
    shortList = _.reject(shortList,function(user){
      return user.id === that.id;
    });
    Session.set('shortList',shortList);
  },

  'click .add-users': function(event){
    event.preventDefault();

    var shortList = Session.get('shortList');
    var bubbleInfo = Session.get('bubbleInfo');

    var shortListIds = _.map(shortList, function(user){
      return user.id;
    });

    if (bubbleInfo.type === 'super') {
      Bubbles.update({_id: bubbleInfo.id},
      {
        $addToSet: {'users.members': {$each: shortListIds}}
      }, function(){
        window.location.href = "/mybubbles/"+bubbleInfo.id+"/members";
        //REPLACE WITH SOMETHING REACTIVE
        /*$('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'members']
          //timeout: 2000
        });*/
      });
    } else {
      Bubbles.update({_id: bubbleInfo.id},
      {
        $addToSet: {'users.invitees': {$each: shortListIds}}
      }, function(){
        window.location.href = "/mybubbles/"+bubbleInfo.id+"/members";
        //REPLACE ME WITH SOMETHING REACTIVE
        /*$('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'invitees']
          //timeout: 2000
        });*/
      });
    }

    //Create notifications
    if (bubbleInfo.bubbleType === 'super') {
      _.each(shortListIds, function(userId) {
        createNewMemberUpdate(userId);
      });
    } else {
      createInvitationUpdate(shortListIds);
    }
  }
});

Template.bubbleInvitation.helpers({

  getSearchResponse: function() {
    var searchRes = Session.get('searchRes');
    var bubbleInfo = Session.get('bubbleInfo');
    var rejectList = bubbleInfo.users.admins.concat(bubbleInfo.users.members);
    var filteredList = _.reject(searchRes,function(user){
      if (_.contains(rejectList,user.id)) {
        return true;
      } else {
        return false;
      }
    });
    return filteredList;
  },

  potentialInvitees: function() {
    return Session.get('shortList');
  },

  getNumSelected: function() {
    return (Session.get('shortList') || []).length;
  },

  selected: function() {
    var that = this;

    return (isApplicant(that.id) || isInvitee(that.id) || isShortlisted(that.id));
  },

  numPosts: function() {
    //FIX ME!!
    return 0;
  }
});

Template.bubbleInvitation.created = function() {
  var currentBubbleId = window.location.pathname.split('/')[2];
};

Template.bubbleInvitation.destroyed = function() {
  delete Session.keys['searchRes','shortList','selectList'];
};

Template.bubbleInvitation.rendered = function() {

};

function isInvitee(userId) {
  var invitees = Session.get('bubbleInfo').users.invitees || [];

  return _.contains(invitees,userId);
};

function isApplicant(userId) {
  var applicants = Session.get('bubbleInfo').users.applicants || [];

  return _.contains(applicants,userId);
};

function isShortlisted(userId) {
  var shortList = Session.get('shortList') || [];
  var shortListIds = _.map(shortList, function(user) {
    return user.id;
  });

  return _.contains(shortListIds,userId);
};

function addToShortlist(user) {
  var shortList = Session.get('shortList') || [];
  shortList.push(user);
  Session.set('shortList',shortList);
};