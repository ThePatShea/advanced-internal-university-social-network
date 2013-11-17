Template.searchPage.helpers({

  isActive: function(category) {
    return (category === Session.get('searchCategory')) ? 'active' : false;
  }

});

Template.searchPage.events({
  'click .search-btn': function(event) {
    event.preventDefault();
    event.stopPropagation();

    var searchText = $('.searchText').val();
    (!!Session.get('searchText') ? Session.set('searchText', '') : Session.set('searchText', searchText));

  }
});

Template.searchPage.rendered = function() {

  var searchText = $('.searchText').val();
  !!Session.get('searchText') ? Session.set('searchText', searchText) : Session.set('searchText', '');

  Meteor.subscribe('findUsersById', Session.get('selectedUserIdList'));
  Meteor.subscribe('findPostsById', Session.get('selectedPostIdList'));
  Meteor.subscribe('findBubblesById', Session.get('selectedBubbleIdList'));

  $(document).attr('title', 'Search - Emory Bubble');
}
