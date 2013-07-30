Template.sidebarOld.helpers({
  getSidebarBubbles: function(){
    return Bubbles.find({
      $or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}, 
      {sort: {'users.members': -1, 'users.admins': -1, 'submitted': -1}
    });
  },
  getInvitations: function() {
    invitees = [Meteor.userId()];
    var bubbles =  Bubbles.find({'users.invitees': Meteor.userId()});
    return bubbles;
  },
  hasInvitations: function() {
    var bubbles =  Bubbles.find({'users.invitees': Meteor.userId()});
    if(bubbles.count() >0){
      return true;
    }
    return false;
  },
  getSearchUrl: function() {
    Session.set('searchText',undefined);
    if(Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).count() > 0){
      return '/mybubbles/search/all';
    }else{
      return '/mybubbles/search/bubbles';
    }
  }
});

Template.sidebarOld.events({
  'click .accept-invitation': function(){
    Bubbles.update({_id:this._id},
    {
      $addToSet: {'users.members': Meteor.userId()},
      $pull: {'users.invitees': Meteor.userId()}
    });

    //Create new user notification
    createNewMemberUpdate(Meteor.userId(), this._id);
    Meteor.call('setRead', Updates.findOne({userId:Meteor.userId(), bubbleId:this._id, updateType:"INVITATION"}));
  },
  'click .reject-invitation': function(){
    if (confirm("Reject this invitation?")) {
      Bubbles.update({_id:this._id},
      {
        $pull: {'users.invitees': Meteor.userId()}
      });
    }
  }
}); 

Template.sidebarOld.rendered = function() {

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
