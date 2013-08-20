Template.searchUsers.created = function() {
  searchedUsers = [];
  searchResponse = false;
  mto = "";
  Session.set("selectedUserIdList", []);
  Session.set('typing', 'false');
}

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

  $(".search-text").unbind("propertychange keyup input paste");
  $(".search-text").bind("keydown", function(evt) {
    Session.set('typing', 'true');
  });
  $(".search-text").bind("keyup", function(evt) {
      Meteor.clearTimeout(mto);
      mto = Meteor.setTimeout(function() {
        Meteor.call('search_users', $(".search-text").val(), function(err, res) {
          if(err) {
            console.log(err);
          } else {
            Session.set('typing', 'false');
            searchResponse = true;
            console.log("RE: sponse");
            Session.set('selectedUserIdList', res);
          }
        });
      }, 500);
  });
}

Template.searchUsers.helpers({

  typing: function() {
    return Session.get("typing");
  },

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
    return Meteor.users.find({_id: {$in: Session.get('selectedUserIdList')}},{limit:10});
  },

  searchUsers: function() {
    if(Session.get('searchText').length > 2)
    {
      console.log('searching users');
      Meteor.call('search_users', Session.get('searchText'), function(err, res) {
        if(err) {
          console.log(err);
        } else {
          searchResponse = true;
          Session.set('selectedUserIdList', res);
        }
      });
    }
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

