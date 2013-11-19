Template.searchUsers.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    if(!DisplayHelpers.isMobile()) {
      SearchHelpers.searchUsersREST(searchText, function(err, res) {
        if (!err)
          Session.set('selectedUserIdList', res);
      });
    }
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    SearchHelpers.searchUsersREST(searchText, function(err, res) {
      if (!err)
        Session.set('selectedUserIdList', res);
    });
  }
});



Template.searchUsers.helpers({
  getSearchedUsers: function() {
    return Session.get('selectedUserIdList');
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchUsers.created = function() {
  Session.set("selectedUserIdList", []);
}



Template.searchUsers.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'users');
  $(document).attr('title', 'Search Users - Emory Bubble');
}


