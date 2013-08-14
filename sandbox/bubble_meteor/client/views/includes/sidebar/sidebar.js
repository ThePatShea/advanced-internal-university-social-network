Template.sidebar.helpers({
    sidebarOpen            : function() {
      return Session.get('sidebarOpen');
    }
  , subsectionPaneVisible  : function() {
      var currentSection = window.location.pathname.split("/")[1];
      //console.log(currentSection);

      if ((currentSection == 'search') || (currentSection == 'dashboard'))
        return false;
      else
        return true;
    }
  , myBubblesLink          : function() {
      var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
      if(bubbles.length > 0) {
        return '/mybubbles/' + bubbles[0]._id + '/home';
      }else {
        return '/mybubbles/create/bubble';
      }
    },

    exploreLink: function(){
      var explores = Explores.find({}).fetch();
      if(explores.length > 0){
        return '/explore/' + explores[0]._id + '/home';
      }
      else{
        return '/explore/create';
      }
    }
  , selectedSection        : function(inputSection) {
      var currentUrl  =  window.location.pathname;
      var urlArray    =  currentUrl.split("/");

      return urlArray[1] == inputSection;
    }
  , selectedSubsectionName : function(inputName) {
      var currentUrl  =  window.location.pathname;
      var urlArray    =  currentUrl.split("/");
       
      return urlArray[2] == inputName;
    }
  , selectedSubsection     : function() {
   //   var currentUrl  =  window.location.pathname;
   //   var urlArray    =  currentUrl.split("/");
      return Session.get('currentBubbleId') == this._id;
    }
  , userBubbles            : function() {
      return Bubbles.find({
        $or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},
        {sort: {'users.members': -1, 'users.admins': -1, 'submitted': -1}
      });
    }
  , publicExplores         : function() {
      return Explores.find({}).fetch();
  }
  , selectedExploreSubsection : function(exploreId){
      var currentExploreId = Session.get('currentExploreId');
      return (currentExploreId == exploreId);
  }
  , getExploreIcon: function(exploreObject){
      var iconName = exploreObject.exploreIcon;
      if(iconName == 'announcements'){
        return Template['icon-official']();
      }
      else if(iconName == 'campus events'){
        return Template['icon-events']();
      }
      else if(iconName == 'classifieds'){
        return Template['icon-classifieds']();
      }
      else if(iconName == 'professor reviews'){
        return Template['icon-professorreviews']();
      }
      else if(iconName == 'controversial topics'){
        return Template['icon-controversial']();
      }
      else if(iconName == 'student deals'){
        return Template['icon-deals']();
      }
      else if(iconName == 'nightlife'){
        return Template['icon-nightlife']();
      }
  }
  ,
  getExploreIconName: function(exploreObject){
      var iconName = exploreObject.exploreIcon;
      if(iconName == 'announcements'){
        return 'icon-official';
      }
      else if(iconName == 'campus events'){
        return 'icon-events';
      }
      else if(iconName == 'classifieds'){
        return 'icon-classifieds';
      }
      else if(iconName == 'professor reviews'){
        return 'icon-professorreviews';
      }
      else if(iconName == 'controversial topics'){
        return 'icon-controversial';
      }
      else if(iconName == 'student deals'){
        return 'icon-deals';
      }
      else if(iconName == 'nightlife'){
        return 'icon-nightlife';
      }
  },
    hasLevel4Permission: function(){
      return ('4' == Meteor.user().userType && this.userType != '4');
    }
});


Template.sidebar.events({
    'click .btn-nav-subsection, click .add-bubble > .btn-heading' : function() {
      Session.set('sidebarOpen', false);
    }
});




Template.sidebar.rendered = function() {
  // Controls the new sidebar's visibility
    var controlSidebarVisibility = function() {
      if ($(window).width() >= 768)
        Session.set('sidebarOpen', false);
    }

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
      controlSidebarVisibility();
      resizeMainBtns();
      adjustSidebar();
      adjustMain();
    }

    $(window).resize(function() {
      adjustInterface();
    });

    adjustInterface();
}
