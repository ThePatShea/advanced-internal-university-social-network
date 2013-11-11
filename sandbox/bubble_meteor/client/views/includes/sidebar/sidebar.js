var state = {
  data: null
};

// Helpers
function getSubsectionName() {
  // TODO: Fix me
  return window.location.pathname.split("/")[1];
}

function refreshData() {
  var name = getSubsectionName();

  // No need to refresh data if current page is not mybubbles or explores
  if (name !== 'mybubbles' && name !== 'explore')
    return;

  // No need to get data if we did not navigate from same subsection
  if (state.data !== null && state.data.name === name)
    return;

  var data = state.data = new SidebarData.Sidebar(name);

  // TODO: Loading flag
  Session.set('sidebarCollection-' + name, []);
  data.getData(name, function(collection) {
    Session.set('sidebarCollection-' + name, collection);
  });
}

// Events
Template.sidebar.events({
  'click .btn-nav-subsection, click .add-bubble > .btn-heading' : function() {
    Session.set('sidebarOpen', false);
  },
  'click .sidebar-collapse-new' : function() {
    var sidebarOpen = Session.get('sidebarOpen');

    if (sidebarOpen == false)
      Session.set('sidebarOpen', true);
    else
      Session.set('sidebarOpen', false);
  },
  'click .set-loading': function() {
    Session.set('isLoading', true);
  }
});

// Template helpers
Template.sidebar.helpers({
  sidebarOpen: function() {
    return Session.get('sidebarOpen');
  },
  subsectionPaneVisible: function() {
    var section = getSubsectionName();
    return section === 'mybubbles' || section === 'explore' || section === 'settings';
  },
  myBubblesLink: function() {
    // TODO: Use REST API call
    var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]},{sort: {'users.members': -1, 'users.admins': -1}, limit: 1}).fetch();
    if(bubbles.length > 0) {
      return '/mybubbles/' + bubbles[0]._id + '/home';
    }else {
      return '/mybubbles/create';
    }
  },
  exploreLink: function(){
    // TODO: Use REST API call
    var explores = Explores.find({}, {sort: {'submitted': 1}}).fetch();
    if(explores.length > 0){
      return '/explore/' + explores[0]._id + '/home';
    }
    else{
      return '/explore/create';
    }
  },
  dashboardLink: function() {
    return '/dashboard';
  },
  selectedSection: function(inputSection) {
    // TODO: Rewrite me to use Meteor.Router constants
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");

    if (inputSection != 'dashboard') {
      return urlArray[1] == inputSection;
    } else {
      if (urlArray[1] == '' || urlArray[1] == 'dashboard') {
        return true;
      } else {
        return false;
      }
    }
  },
  selectedSubsectionName : function(inputName) {
    var currentUrl  =  window.location.pathname;
    var urlArray    =  currentUrl.split("/");

    return urlArray[2] == inputName;
  },
  selectedSubsection: function() {
    // TODO: Fix me?
    return Session.get('currentBubbleId') == this._id;
  },
  userBubbles: function() {
    return Session.get('sidebarCollection-mybubbles');
  },
  publicExplores: function() {
    return Session.get('sidebarCollection-explore');
  },
  selectedExploreSubsection : function(exploreId){
    var currentExploreId = Session.get('currentExploreId');
    return (currentExploreId == exploreId);
  },
  getExploreIcon: function(exploreObject){
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
  },
  getExploreIconName: function(exploreObject) {
    var iconName = exploreObject.exploreIcon;
    if (iconName === 'announcements'){
      return 'icon-official';
    } else
    if (iconName === 'campus events'){
      return 'icon-events';
    } else
    if (iconName === 'classifieds'){
      return 'icon-classifieds';
    } else
    if (iconName === 'professor reviews'){
      return 'icon-professorreviews';
    } else
    if(iconName === 'controversial topics'){
      return 'icon-controversial';
    } else
    if(iconName === 'student deals'){
      return 'icon-deals';
    } else
    if(iconName === 'nightlife'){
      return 'icon-nightlife';
    }
  },
  hasLevel4Permission: function() {
    return (Meteor.user().userType === '4' && this.userType !== '4');
  }
});


Template.sidebar.created = function(){
  // TODO: Unsubscribe
  // TODO: Really necessary?
  Meteor.subscribe('sidebarBubbles', Meteor.userId());
  Meteor.subscribe('allExplores');
  Meteor.subscribe('findUsersById', [Meteor.userId()]);
};

Template.sidebar.rendered = function() {
  // Refresh data
  refreshData();

  // Controls the new sidebar's visibility
  var controlSidebarVisibility = function() {
    if ($(window).width() >= 768)
      Session.set('sidebarOpen', false);
  };

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
  };

  // Change the direction of the sidebar-arrow depending on if the sidebar is open or closed
  $('.sidebar-collapse').click(function() {
    if ($('#menu').width() === $('.sidebar').width()) {
      $('.sidebar-arrow-right').show();
      $('.sidebar-arrow-left').hide();
    } else if ( $('#menu').width() === 0 ) {
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
      if ($('#menu').width() === 0)
        $('#menu').collapse('show');
    }
  };

  // Resize the main section to make scrolling work properly
  var adjustMain = function() {
    $('#main').css('height', $(window).height() - $('.navbar').height());
  };

  // Collapse the sidebar menu when the user clicks a button
  $('#menu a').click(function() {
    if ($(window).width() < 768)
      $('#menu').collapse('hide');
  });

  // Run these functions on load and on window resize
  var adjustInterface = function() {
    controlSidebarVisibility();
    resizeMainBtns();
    adjustSidebar();
    adjustMain();
  };

  $(window).resize(function() {
    adjustInterface();
  });

  adjustInterface();
};

Template.sidebar.destroyed = function() {
  this.watch.stop();
};