Template.header.created = function() {
  Session.set('sidebarOpen', false);
  headerDep = new Deps.Dependency;
  uId = Meteor.userId();
  userObject = new UserData.UserInfo({id: uId});
  userObject.fetch({success: function(){
    headerDep.changed();
  }});
  //user = userObject.toJSON();
}

Template.header.helpers({
  activeRouteClass: function(routeName) {
    var pathname = window.location.pathname.split('/')[1];
    if(pathname == routeName) {
      return 'active';
    }else if(pathname == routeName) {
      return 'active';
    }
  },
  getMyBubblesUrlPath: function() {
    var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
    if(bubbles.length > 0) {
      if(Session.get('currentBubbleId')){
        return '/mybubbles/' + Session.get('currentBubbleId') + '/home';
      }else{
        return '/mybubbles/' + bubbles[0]._id + '/home';
      }
    }else{
      return '/mybubbles/search/bubbles';
    }
  },
  checkUserType: function(userType) {
    //return Meteor.user().userType == userType;
    var user = userObject.toJSON();
    return user.userType
  },
  currentUser: function(){
    headerDep.depend();
    return userObject.toJSON();
  }
});
