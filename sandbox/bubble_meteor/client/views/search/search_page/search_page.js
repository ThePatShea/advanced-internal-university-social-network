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
  if ( !Session.get('searchText') )
    Session.set('searchText', ' ');

  if($(window).width() < 768)
  {
    $('.search-btn').removeClass('visible-0');
    $('.search-btn').addClass('visible-1');
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
}
