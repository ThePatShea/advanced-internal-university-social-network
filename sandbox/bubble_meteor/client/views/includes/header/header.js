Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    
    var active = _.any(args, function(name) {
      return location.pathname === Meteor.Router[name + 'Path']();
    });
    
    return active && 'active';
  },
  getMyBubblesUrlPath: function() {
    
    if(Session.get('currentBubbleId')) { 
      return '/mybubbles/' + Session.get('currentBubbleId') + '/home';
    }else{
      var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
      if(bubbles.length > 0) {
        return '/mybubbles/' + bubbles[0]._id + '/home';
      }
    }
    return '/mysearch/bubbles';
  }
});
