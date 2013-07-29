Template.sidebar.helpers({
    myBubblesLink: function() {
      var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
      if(bubbles.length > 0) {
        return '/mybubbles/' + bubbles[0]._id + '/home';
      }else {
        return '/mybubbles/create/bubble';
      }
    }
  , selectedSection    : function(inputSection) {
      var currentUrl  =  window.location.pathname;
      var urlArray    =  currentUrl.split("/");

      return urlArray[1] == inputSection;
    }
  , selectedSubsection : function() {
      var currentUrl  =  window.location.pathname;
      var urlArray    =  currentUrl.split("/");
       
      return urlArray[2] == this._id;
    }
  , userBubbles        : function() {
      return Bubbles.find({
        $or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},
        {sort: {'users.members': -1, 'users.admins': -1, 'submitted': -1}
      });
    }
});





Template.sidebar.rendered = function() {

  // Handles the cancel button for forms
    $('.visible-toggle-parent').click(function() {
      if ($(this).hasClass('toggle-hide')) {
        $(this).removeClass('toggle-hide');
        $(this).addClass('toggle-show');
      } else {
        $(this).removeClass('toggle-show');
        $(this).addClass('toggle-hide');
      }
    });

  // Make textareas in forms resize automatically when the user inputs a lot of text
    $('textarea').autoResize();

  // Ensure that the sidebar has a scroll bar whenever it has more buttons than can fit on it
    var resizeMainBtns = function() {
      $('.main-btns').height($(window).height() - $('.navbar').height() - $('.top-btns').height());
    }


  // Change the direction of the sidebar-arrow depending on if the sidebar is open or closed
    $(".sidebar-collapse").click(function(e) {
      if ( $('#menu').width() == $('.sidebar').width() ) {
        $('.sidebar-arrow-right').show();
        $('.sidebar-arrow-left').hide();
      } else if ( $('#menu').width() == 0 ) {
        $('.sidebar-arrow-right').hide();
        $('.sidebar-arrow-left').show();
      }
    });


  // Resize the sidebar based on whether the window is desktop width or mobile width
    var adjustSidebar = function() {
      if ($(window).width() < 768) {
        if ($('#menu').width() > 0)
          $('#menu').collapse('hide');
      } else {
        if ($('#menu').width() == 0)
          $('#menu').collapse('show');
      }
    }


  // Resize the main section to make scrolling work properly
    var adjustMain = function() {
      $('#main').css('height', $(window).height() - $('.navbar').height());
    }


  // Collapse the sidebar menu when the user clicks a button
    $("#menu a").click(function(e) {
      if ($(window).width() < 768)
        $('#menu').collapse('hide');
    });


  // Run these functions on load and on window resize
    var adjustInterface = function() {
      resizeMainBtns();
      adjustSidebar();
      adjustMain();
    }

    $(window).resize(function() {
      adjustInterface();
    });

    adjustInterface();
}
