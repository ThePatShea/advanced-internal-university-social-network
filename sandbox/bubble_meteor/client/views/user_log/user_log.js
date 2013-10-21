Template.userlog.created = function(){
  console.log('Analytics template created.');
  Meteor.subscribe('currentUserlogs', Meteor.userId());
}

Template.userlog.helpers({
  getUserlogs: function() {
    if(Session.get('selectedUsername')) {
      //Shrinks user list based on input name
      var userList = Meteor.users.find({username: new RegExp(Session.get('selectedUsername'),'i')}).fetch();
      if(userList.length>0){
        var userIdList = _.pluck(userList,'_id');
        return _.toArray(_.groupBy(Userlogs.find({userId: {$in: userIdList}}).fetch()));
      }
    }else{
      var userDic = _.groupBy(Userlogs.find().fetch(),'userId');
      Session.set('selectedUserIdList', Object.keys(userDic));
      return _.toArray(_.groupBy(Userlogs.find().fetch(),'userId'));
    }
    return [];
  },
  // getUsersActivity: function(username) {
  //   return Userlogs.find({userId: Session.get('selectedUserId')});
  // },
  groupByPage: function() {
    return _.toArray(_.groupBy(this,'page'));
  },
  getPageCount: function() {
    return this.length;
  },
  getPageName: function() {
    return this[0].page;
  },
  getUsername: function() {
    var user = Meteor.users.findOne(this[0].userId);
    if(user){
      return user.username; 
    }
    
  },
  getUsersWithMultipleLogin: function() {
    return _.toArray(_.groupBy(Userlogs.find({login: true}).fetch(),'userId'));
  },
  getLoginCount: function() {
    return this.length;
  },
  countUsersWithMultipleLogin: function() {
    return Userlogs.find({login:true}).count();
  }
});

Template.userlog.rendered = function() {
  console.log('Analytics page.');
  $(".search-text").bind("propertychange keyup input paste", function (event) {
    var searchText = $(".search-text").val();
    if (searchText == ""){
      Session.set('selectedUsername', undefined);
    }else{
      Session.set('selectedUsername', searchText);
    }
  });
}

Template.userlog.events({
  'click .csv-submit': function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    window.open("localhost:3030/bubbleanalytics.csv?start=" + $("#start-date").val() + "&end=" + $("#end-date").val());
  }
})