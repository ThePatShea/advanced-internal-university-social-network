Template.searchPage.helpers({
  isActive: function(category) {
    if(category == Session.get('searchCategory')){
      return 'active';
    }else{
      return false;
    }
  }
});

Template.searchPage.rendered = function() {

  $(".search-text").bind("propertychange keyup input paste", function (event) {
    var searchText = $(".search-text").val();
    if (searchText == ""){
      Session.set('searchText',undefined);
    }else if(Meteor.Router.page() == 'searchAll' && searchText.length > 2) {
      Session.set('searchText',searchText);
    }else if(Meteor.Router.page() != 'searchAll'){
      Session.set('searchText', searchText);
    }else{
      Session.set('searchText', searchText);
      
    }
  });
}