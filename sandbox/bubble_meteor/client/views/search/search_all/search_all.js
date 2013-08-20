function searchCompare(a,b) {
  if (a.title)
    a.word = a.title
  else if (a.username)
    a.word = a.username
  else if (a.name)
    a.word = a.name

  if (b.title)
    b.word = b.title
  else if (b.username)
    b.word = b.username
  else if (b.name)
    b.word = b.name

  if (a.word < b.word)
     return -1;
  if (a.word > b.word)
    return 1;
  return 0;
}

Template.searchAll.helpers({
  getSearchedAll: function() {
    var searchedBubbles = Bubbles.find(
      { $or: [
        {title: new RegExp(Session.get('searchText'),'i')},
        {description: new RegExp(Session.get('searchText'),'i')}
        ]
      }, {limit:searchBubblesHandle.limit()}).fetch();

    var searchedDiscussions = Posts.find(
      { postType: 'discussion',
        $or: [
        {name: new RegExp(Session.get('searchText'),'i')},
        {body: new RegExp(Session.get('searchText'),'i')}
        ]
      }, {limit: searchDiscussionsHandle.limit()}).fetch();

    var searchedEvents = Posts.find(
      { postType: 'event',
        $or: [
        {name: new RegExp(Session.get('searchText'),'i')},
        {body: new RegExp(Session.get('searchText'),'i')},
        {location: new RegExp(Session.get('searchText'),'i')}
        ]
      }, {limit: searchEventsHandle.limit()}).fetch();

    var posts =  Posts.find(
      { postType: 'file',
        name: new RegExp(Session.get('searchText'),'i')
      }, {limit: searchFilesHandle.limit()}).fetch();

    // return posts where searchText is not similar to file extension
    if(posts) {
      var searchedFiles = _.reject(posts, function(post) {
        nameList = post.name.split('.');
        if(nameList.length>1) {
          return nameList[nameList.length-1].match(new RegExp(Session.get('searchText'), 'i'));
        }
      });
    }

    /*Session.set('selectedUsername',Session.get('searchText'));
    var searchedUsers = Meteor.users.find(
      {
        username:new RegExp(Session.get('searchText'),'i')
      }, {limit: usersListHandle.limit()}).fetch();*/
    var searchedUsers = Meteor.users.find({username: "taggartbg"});

    
    var searchedAll  =  searchedBubbles.concat(searchedDiscussions, searchedEvents, searchedFiles, searchedUsers);

    return searchedAll;
  },
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
/*    Session.set('selectedUsername',Session.get('searchText'));
    return Meteor.users.find(
      {
        username:new RegExp(Session.get('searchText'),'i'),
        _id: {$nin: [Meteor.userId()]}
      }, {limit: 3});*/
  }
});

Template.searchAll.rendered = function() {
  // To set header as active
  Session.set('searchCategory','all');
  Session.set('currentBubbleId','');
 

  // For infinite scroll
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchAll'){
        this.searchBubblesHandle.loadNextPage();
        this.searchDiscussionsHandle.loadNextPage();
        this.searchEventsHandle.loadNextPage();
        this.searchFilesHandle.loadNextPage();
        this.usersListHandle.loadNextPage();
      }
    }
  }); 
}
