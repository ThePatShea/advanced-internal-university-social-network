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
    var shortList = Session.get('shortList') || [];
    console.log("SHORTLIST ME: ", that);
    if(_.contains(Session.get('selectList'), that.id))
    {
      return
    }
    for(i in shortList) {
      if(that.id === shortList[i].id)
      {
        return;
      }
    }
    shortList.push(that);
    Session.set('shortList',shortList);
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

    if(bubbleInfo.type === 'super')
    {
      Bubbles.update({_id: bubbleInfo.id},
      {
        $addToSet: {'users.members': {$each: shortListIds}}
      }, function(){
        window.location.href = "/mybubbles/"+bubbleInfo.id+"/members";
      });
    } else {
      Bubbles.update({_id: bubbleInfo.id},
      {
        $addToSet: {'users.invitees': {$each: shortListIds}}
      }, function(){
        window.location.href = "/mybubbles/"+bubbleInfo.id+"/members";
      });
    }

    /*
    //convert usernameList into userIdList
    usernameList = Session.get('inviteeList'+Session.get('currentBubbleId'));
    userIdList = [];
    _.each(usernameList, function(username) {
      tmp = Meteor.users.findOne({username:username})._id;
      userIdList.push(tmp);
      Meteor.call("sendInvitedEmail", Meteor.userId(), tmp, Session.get('currentBubbleId'));
    });

    Session.set('recentlyAdded',Session.get('inviteeList'+Session.get('currentBubbleId')));

    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    if(bubble.bubbleType == 'super') {
      Bubbles.update({_id:bubble._id},
      {
        $addToSet: {'users.members': {$each: userIdList}}
      }, function(){
        // TODO: Redo me
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'members']
          //timeout: 2000
        });
      });
    }else{
      //Add Invitees to the bubble object
      //Meteor.call('addInvitee', Session.get('currentBubbleId'), userIdList);
      Bubbles.update({_id:bubble._id}, {$addToSet: {'users.invitees': {$each: userIdList}}}, function(){
        // TODO: Redo me
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'invitees']
          //timeout: 2000
        });
      });
    }

    //Create notifications
    if (this.bubbleType == 'super') {
      _.each(userIdList, function(userId) {
        createNewMemberUpdate(userId);
      });
    }else{
      createInvitationUpdate(userIdList);
    }
    */
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
    var shortList = Session.get('shortList') || [];
    var bubbleInfo = Session.get('bubbleInfo');
    var selectList = bubbleInfo.users.invitees.concat(bubbleInfo.users.applicants);

    _.each(shortList,function(user){
      selectList.push(user.id);
    });

    var retVal = false;
    _.each(selectList, function(userId) {
      if(userId === that.id)
        retVal = true;
    });

    return retVal;
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