Template.searchUsers.helpers({
  getSearchedUsers: function() {
  	Session.set('selectedUsername',Session.get('searchText'));
  	return Meteor.users.find(
      {
        username:new RegExp(Session.get('searchText'),'i'),
        _id: {$nin: [Meteor.userId()]}
      },{limit: usersListHandle.limit()});
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

  //Set the searchText as session variable
  var searchText = $(".search-text").val();
  if (searchText == ""){
    Session.set('searchText',undefined);
  }else{
    Session.set('searchText', searchText);
  }
}