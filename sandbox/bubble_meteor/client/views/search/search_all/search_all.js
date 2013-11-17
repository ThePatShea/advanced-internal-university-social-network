Template.searchAll.helpers({
  getSearchedFiles: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}, postType: "file"},{limit:3});
  },
  getSearchedDiscussions: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}, postType: "discussion"},{limit:3});
  },
  getSearchedEvents: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}, postType: "event"},{limit:3});
  },
  getSearchedUsers: function() {
    return Meteor.users.find({_id: {$in: Session.get('selectedUserIdList')}},{limit:3});
  },
  getSearchedBubbles: function() {
    return Bubbles.find({_id: {$in: Session.get('selectedBubbleIdList')}},{limit:3});
  },

  typing: function() {
    return Session.get("typing");
  }
  
});

Template.searchAll.rendered = function() {
  // To set header as active
  Session.set('searchCategory','all');
  Session.set('currentBubbleId','');


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
              Session.set('selectedUserIdList', res);
            }
          });
          Meteor.call('search_bubbles', $(".search-text").val(), function(err, res) {
            if(err) {
              console.log(err);
            } else {
              Session.set('typing', 'false');
              Session.set('selectedBubbleIdList', res);
            }
          });
          Meteor.call('search_files', $(".search-text").val(), function(err, res) {
            if(err) {
              console.log(err);
            } else {
              Session.set('typing', 'false');
              tmp = res;
              console.log('@files: ' + res);
              Meteor.call('search_events', $(".search-text").val(), function(err, res) {
                if(err) {
                  console.log(err);
                } else {
                  Session.set('typing', 'false');
                  tmp = tmp.concat(res);
                  console.log('@events: ' + res);
                  Meteor.call('search_discussions', $(".search-text").val(), function(err, res) {
                    if(err) {
                      console.log(err);
                    } else {
                      Session.set('typing', 'false');
                      tmp = tmp.concat(res);
                      console.log('@discussions: ' + tmp);
                      Session.set('typing', 'false');
                      Session.set('selectedPostIdList', tmp);
                    }
                  });
                }
              });
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
            Session.set('selectedUserIdList', res);
          }
        });
        Meteor.call('search_bubbles', $(".search-text").val(), function(err, res) {
          if(err) {
            console.log(err);
          } else {
            Session.set('typing', 'false');
            Session.set('selectedBubbleIdList', res);
          }
        });
        Meteor.call('search_files', $(".search-text").val(), function(err, res) {
          if(err) {
            console.log(err);
          } else {
            Session.set('typing', 'false');
            tmp = res;
            console.log('@files: ' + res);
            Meteor.call('search_events', $(".search-text").val(), function(err, res) {
              if(err) {
                console.log(err);
              } else {
                Session.set('typing', 'false');
                tmp = tmp.concat(res);
                console.log('@events: ' + res);
                Meteor.call('search_discussions', $(".search-text").val(), function(err, res) {
                  if(err) {
                    console.log(err);
                  } else {
                    Session.set('typing', 'false');
                    tmp = tmp.concat(res);
                    console.log('@discussions: ' + tmp);
                    Session.set('typing', 'false');
                    Session.set('selectedPostIdList', tmp);
                  }
                });
              }
            });
          }
        });
      }, 500);
  });
 


  $(document).attr('title', 'Search - Emory Bubble');
};



Template.searchAll.created = function() {
  mto = "";
  Session.set('typing', 'false');
  Session.set("selectedPostIdList", []);
  Session.set("selectedBubbleIdList", []);
  Session.set("selectedUserIdList", []);
  var tmp = [];
}