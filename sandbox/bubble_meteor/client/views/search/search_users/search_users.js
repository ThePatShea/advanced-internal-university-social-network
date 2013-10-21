Template.searchUsers.created = function() {
  mto = "";
  Session.set('typing', 'false');
  Session.set("selectedUserIdList", []);
}

Template.searchUsers.events({
  /*
  "click .search-btn": function(evt){
    Meteor.call('search_users', $(".search-text").val(), function(err, res) {
      if(err) {
        console.log(err);
      } else {
        Session.set('typing', 'false');
        Session.set('selectedUserIdList', res);
      }
    });
  }
  */
})

Template.searchUsers.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'users');

  /*$(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchUsers'){
        this.usersListHandle.loadNextPage();
      }
    }
  });*/
  if($(window).width() > 768)
  {
    $(".search-text").bind("keydown", function(evt) {
      Session.set('typing', 'true');
    });
    $(".search-text").bind("propertychange keyup input paste", function(evt) {
      Meteor.clearTimeout(mto);
      mto = Meteor.setTimeout(function() {
        Meteor.call('search_users', $(".search-text").val(), function(err, res) {
          if(err) {
            console.log(err);
          } else {
            Session.set('typing', 'false');
            Session.set('selectedUserIdList', res);
          }
        });
      }, 500);
    });
  }
  $(".search-btn").bind("click", function(evt) {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      Meteor.call('search_users', $(".search-text").val(), function(err, res) {
        if(err) {
          console.log(err);
        } else {
          Session.set('typing', 'false');
          Session.set('selectedUserIdList', res);
        }
      });
    }, 500);
  });
  $(document).attr('title', 'Search Users - Emory Bubble');
}

Template.searchUsers.helpers({

  typing: function() {
    return Session.get("typing");
  },

  getSearchedUsers: function() {
    return Meteor.users.find({_id: {$in: Session.get('selectedUserIdList')}},{limit:10});
  }
});

