Template.searchPage.helpers({
  isActive: function(category) {
    if(category == Session.get('searchCategory')){
      return 'active';
    }else{
      return false;
    }
  }
});

Template.searchPage.events({
  'click .search-btn': function(event) {
    event.preventDefault();
    event.stopPropagation();
    if ( !Session.get('searchText') )
      Session.set('searchText', ' ');
    var searchText = $(".search-text").val();
    if (searchText == ""){
      Session.set('searchText',undefined);
    }else{
      Session.set('searchText', searchText);
    }
  }
});

Template.searchPage.rendered = function() {
  if ( !Session.get('searchText') )
    Session.set('searchText', ' ');
  Meteor.subscribe('findUsersById', Session.get('selectedUserIdList'));
  Meteor.subscribe('findPostsById', Session.get('selectedPostIdList'));
  Meteor.subscribe('findBubblesById', Session.get('selectedBubbleIdList'));

  
  /*
  if($(window).width() < 768)
  {
    $('.search-btn').bind("click", function(evt) {
      var searchText = $(".search-text").val();
      if (searchText == ""){
        Session.set('searchText',undefined);
      }else{
        Session.set('searchText', searchText);
      }
    });
  } else {
    $(".search-text").bind("propertychange keyup input paste", function (event) {
      var searchText = $(".search-text").val();
      if (searchText == ""){
        Session.set('searchText',undefined);
      } else {
        Session.set('searchText', searchText);
      }
    });
  }
  */
  $(document).attr('title', 'Search - Emory Bubble');
}
