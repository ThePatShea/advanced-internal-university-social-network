searchedUsers = [];
searchResponse = false;

Template.searchUsers.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'users');

  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchUsers'){
        this.usersListHandle.loadNextPage();
      }
    }
  });
}

Template.searchUsers.helpers({
  getSearchedUsers: function() {
    searchResponse = false;
    searchedUsers = [];
    /*
    _.each(Session.get('selectedUserIdList'), function(id) {
      tmp = Meteor.users.find({_id: id});
      console.log("tmp: " + tmp.fetch());
      searchedUsers.push(Meteor.users.find({_id: id}));
    });
    return searchedUsers;
    */
    return Meteor.users.find({_id: {$in: Session.get('selectedUserIdList')}});
  },

  searchUsers: function() {
    console.log('searching users');
    Meteor.call('search_users', Session.get('searchText'), function(err, res) {
      if(err) {
        console.log(err);
      } else {
        searchResponse = true;
        Session.set('selectedUserIdList', res);
      }
    });
  },

  hasSearchResponse: function() {
    if(searchResponse) {
      console.log("hasSearchResponse: true");
      return true;
    } else {
      console.log("hasSearchResponse: false");
      return false;
    }
  }
});