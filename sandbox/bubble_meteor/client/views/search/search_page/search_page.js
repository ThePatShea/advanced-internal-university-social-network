Template.searchPage.events({
  'click .search-btn': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var searchText = $('.searchText').val();
    (!!Session.get('searchText') ? Session.set('searchText', '') : Session.set('searchText', searchText));
  }
});



Template.searchPage.helpers({
  isActive: function(category) {
    return (category === Session.get('searchCategory')) ? 'active' : false;
  }
});



Template.searchPage.rendered = function() {
  var searchText = $('.searchText').val();
  !!Session.get('searchText') ? Session.set('searchText', searchText) : Session.set('searchText', '');

  Meteor.subscribe('findUsersById', Session.get('selectedUserIdList'));
  Meteor.subscribe('findBubblesById', Session.get('selectedBubbleIdList'));
  Meteor.subscribe('findPostsById', Session.get('selectedDiscussionIdList'));
  Meteor.subscribe('findPostsById', Session.get('selectedEventIdList'));
  Meteor.subscribe('findPostsById', Session.get('selectedFileIdList'));
  //Meteor.subscribe('findPostsById', Session.get('selectedPostIdList'));

  $(document).attr('title', 'Search - Emory Bubble');
}
