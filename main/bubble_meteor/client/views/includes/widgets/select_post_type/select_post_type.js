Template.selectPostType.helpers({
  activePostTypeClass: function() {
    var pathArray        =  window.location.pathname.split( '/' );
    var currentPostType  =  pathArray[4];
    var buttonPostType   =  arguments[0];

    return (currentPostType === buttonPostType) && 'active';
  }
});
