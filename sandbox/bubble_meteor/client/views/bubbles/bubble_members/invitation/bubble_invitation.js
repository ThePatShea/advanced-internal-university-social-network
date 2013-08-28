
Template.bubbleInvitation.created = function() {
  findResponse = false;
  rejectList = [];
  var users = Bubbles.findOne({_id: Session.get('currentBubbleId')}).users;
  rejectList = rejectList.concat(users.invitees, users.admins, users.members, users.invitees, users.applicants); 
  rejectList.push(Meteor.userId());
  mto = [];
  Session.set('potentialUserIdList',[]);
}

Template.bubbleInvitation.rendered = function() {

  /*$(".search-text").bind("propertychange keyup input paste", function (event) {
    Session.set('currentlySearching', 'true');  // Keeps the add-members form open, not collapsed

    var searchText = $(".search-text").val();
    if (searchText == ""){
      Session.set('selectedUsername',undefined);
    }else{
      Session.set('selectedUsername', searchText);
    }
  });*/
  Meteor.subscribe('findUsersById', Session.get('potentialUserIdList'));
  Session.set('currentlySearching', 'true');
  $(".search-text").unbind("propertychange keyup input paste")
  $(".search-text").bind("propertychange keyup input paste", function(evt) {
      Meteor.clearTimeout(mto);
      mto = Meteor.setTimeout(function() {
        Meteor.call('search_users', $(".search-text").val(), function(err, res) {
          if(err) {
            console.log(err);
          } else {
            console.log("response");
            Session.set('potentialUserIdList', res);
          }
        });
      }, 500);
  });
}


Template.bubbleInvitation.helpers({
  findUsers: function() {
    //Convert username list -> userId list
    /*inviteeIdList = _.map(Session.get('inviteeList'+Session.get('currentBubbleId')), function(username){
      if(Meteor.users.findOne({username:username})) {
        return Meteor.users.findOne({username:username})._id;
      }
    });*/

    //The regular expression is used here again to prevent showing 
    //users who are removed from bubble but still exists in the local db
    /*return Meteor.users.find(
      {
        _id: {$nin: rejectList}, 
        username: new RegExp(Session.get('selectedUsername'),'i')
      }, {limit: 5});*/
    if(Session.get('selectedUsername').length > 3)
    {
      console.log('searching users');
      Meteor.call('search_users', Session.get('selectedUsername'), function(err, res) {
        if(err) {
          console.log(err);
        } else {
          console.log(res[0]);
          Session.set('potentialUserIdList', res);
          findResponse = true;
        }
      });
    }
  },
  getFoundUsers: function() {
    //findResponse = false;
    //console.log('hereyago: ' + Session.get('potentialUserIdList')[0]);
    return Meteor.users.find({_id: {$in: Session.get('potentialUserIdList'), $nin: rejectList}},{limit: 6});
    //return Meteor.users.find(({username: "taggartbg"}));
  },
  hasSearchResponse: function() {
    if(findResponse) {
      console.log("hasSearchResponse: true");
      return true;
    } else {
      console.log("hasSearchResponse: false");
      return false;
    }
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
  },
  selected: function(){
    inviteeIdList = _.map(Session.get('inviteeList'+Session.get('currentBubbleId')), function(username){
      if(Meteor.users.findOne({username:username})) {
        return Meteor.users.findOne({username:username})._id;
      }
    });
    return(_.contains(inviteeIdList,this._id));
  },
    numPosts: function() {
    var uid = this._id;
    var numPosts = Posts.find({'userId': uid}).count();
    return numPosts;
  },
  userId: function() {
    return this._id;
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
      $('#'+this._id).addClass('selected');
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
      tmp = Meteor.users.findOne({username:username})._id;
      userIdList.push(tmp);
      Meteor.call("sendInvitedEmail", Meteor.userId(), tmp, Session.get('currentBubbleId'));
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
