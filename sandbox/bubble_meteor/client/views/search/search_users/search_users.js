
Template.searchUsers.helpers({
  getSearchedUsers: function() {
  	Session.set('selectedUsername',Session.get('searchText'));
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
  },
});

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