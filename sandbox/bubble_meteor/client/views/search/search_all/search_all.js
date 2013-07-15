Template.searchAll.helpers({
  getSearchedBubbles: function() {
    return Bubbles.find(
      { $or: [
        {title: new RegExp(Session.get('searchText'),'i')}, 
        {description: new RegExp(Session.get('searchText'),'i')}
        ]
      }, {limit:2});
  },
  getSearchedDiscussions: function() {
    return Posts.find(
      { postType: 'discussion',
        $or: [
        {name: new RegExp(Session.get('searchText'),'i')}, 
        {body: new RegExp(Session.get('searchText'),'i')}
        ]
      }, {limit:2});
  },
  getSearchedEvents: function() {
    return Posts.find(
      { postType: 'event',
        $or: [
        {name: new RegExp(Session.get('searchText'),'i')}, 
        {body: new RegExp(Session.get('searchText'),'i')},
        {location: new RegExp(Session.get('searchText'),'i')}
        ]
      }, {limit:2});
  },
  getSearchedFiles: function() {

    var posts =  Posts.find(
      { postType: 'file',
        name: new RegExp(Session.get('searchText'),'i')
      }, {limit: 2}).fetch();

    // return posts where searchText is not similar to file extension
    if(posts) {
      return _.reject(posts, function(post) { 
        nameList = post.name.split('.');
        if(nameList.length>1) {
          return nameList[nameList.length-1].match(new RegExp(Session.get('searchText'), 'i'));
        }
      });
    }
  },
  getSearchedUsers: function() {
    Session.set('selectedUsername',Session.get('searchText'));
    return Meteor.users.find(
      {
        username:new RegExp(Session.get('searchText'),'i'),
        _id: {$nin: [Meteor.userId()]}
      }, {limit: 3});
  }
});

Template.searchAll.rendered = function() {
  //To set header as active
  Session.set('searchCategory','all');

  
}
