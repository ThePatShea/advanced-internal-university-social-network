searchedUsers = [];

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
/*  	Session.set('selectedUsername',Session.get('searchText'));
    var searchedUsers = Meteor.users.find(
      {
        username:new RegExp(Session.get('searchText'),'i')
      },{limit: usersListHandle.limit()});
    var userList = searchedUsers.fetch();
    var userIds = [];
    for(var i=0; i < userList.length; i++){
      userIds.push(userList[i]._id);
    };

    Meteor.subscribe('findUsersById', userIds);

    return searchedUsers;
    */
    //console.dir("firing getSearchedUsers");
    //return searchedUsers;
    //return Meteor.users.find({username: "taggartbg"});





    Meteor.call('search_users', Session.get('searchText'), function(err, res) {
      if(err) {
        console.log(err);
      } else {
        Session.set('selectedUserIdList', res);
        var searchedUsersInfo = Meteor.users.find({_id: {$in: res} }).fetch();

// TESTING
var array  = searchedUsersInfo;
var output = '';

for (var i = 0; i < searchedUsersInfo.length; i++) {
  object = array[i];
  for (property in object) {
    output += property + ': ' + object[property]+'; ';
  }
}
alert(output);
// TESTING



        return searchedUsersInfo;
      }
    });





  },

  searchUsers: function() {
    Meteor.call('search_users', Session.get('searchText'), function(err, res) {
      if(err) {
        console.log(err);
      } else {
        searchedUsers = [];
        //Meteor.subscribe('findUsersById', res);
        _.each(res, function(id) {
          tmp = Meteor.users.find({_id: id});
          console.log("tmp: " + tmp);
          searchedUsers.push(Meteor.users.find({_id: id}));
        });
        Session.set('selectedUserIdList', res);
      }
    });
  },

  hasSearchResponse: function() {
    if(searchedUsers.length > 0) {
      console.log("hasSearchResponse: true");
      return true;
    } else {
      console.log("hasSearchResponse: false");
      return false;
    }
  }
});