Template.explorePostPageBB.helpers({
  getCurrentPost: function() {
    explorePageDep.depend();
    if(typeof pageData != "undefined")
    {
      pageData.explorePost.fetch({async:false});
      return pageData.explorePost.toJSON();
    }
    else
    {
      return false;
    }
  },
  getPostAsBubbleCategory: function() {
    /*var bubble = Bubbles.findOne(this.postAsId);
    if (bubble) {
      return bubble.category;
    } else {
      return -1;
    }*/
    explorePageDep.depend();
    if(typeof pageData.exploreBubble !== "undefined")
    {
      return pageData.exploreBubble.attributes.category;
    }
    else
    {
      return -1;
    }
  },
  bubbleName: function(){
    explorePageDep.depend();
    if(typeof pageData.exploreBubble !== "undefined")
    {
      return pageData.exploreBubble.attributes.title;
    }
    else
    {
      return "a bubble";
    }
  },
  postedAsUser: function() {
    if (this.postAsType == "user") {
      return true;
    } else {
      return false;
    }
  },
  postedAsBubble: function() {
    if (this.postAsType == "bubble") {
      return true;
    } else {
      return false;
    }
  },
  displayName: function() {
    explorePageDep.depend();
    var tmp = {};
    tmp.title = "";
    console.log("DISPLAY NAME: ", this);
    if (this.postAsType == "user") {
      return this.author;
    } else if (this.postAsType == "bubble") {
      return this.author; //AUTHOR SHOULD BE BUBBLE TITLE NOT POSTER NAME IN THIS CASE
    }
  },
  isFlagged: function() {
    if (this.flagged)
      return true;
    else
      return false;
  },
  getAuthorProfilePicture: function() {
    var user = Meteor.users.findOne(this.userId);
    return user && user.profilePicture;
  },

  notEvent: function(){
    if(this.postType != 'event'){
      return true;
    }
    else{
      return false;
    }
  },

  isEvent: function(){
    if(this.postType == 'event'){
      return true;
    }
    else{
      return false;
    }
  },

  isDiscussion: function(){
    if(this.postType == 'discussion'){
      return true;
    }
    else{
      return false;
    }
  },

  currentExplore: function(){
    return Explores.findOne(Session.get('currentExploreId'));
  }
});

Template.explorePostPageBB.events({
    'click .btn-flag': function() {
      //Google Analytics
      _gaq.push(['_trackEvent', 'Flagging', 'Flag', +this.name]);

      if (confirm("Flagging a post will report it to Bubble moderators as inappropriate. Are you sure you want to flag this post?")) {
        var flagAttributes = {
          postId: this._id,
          bubbleId: this.bubbleId,
          invokerId: Meteor.userId(),
          invokerName: Meteor.user().username,
        }
        Meteor.call('createFlag',flagAttributes);
      }
    }
  , 'click .btn-delete': function(e) {
      //Google Analytics
        _gaq.push(['_trackEvent', 'Post', 'Delete Discussion', this.name]);

      e.preventDefault();
      if (confirm("Are you sure you want to delete this post?")) {
        var currentPostId = Session.get('currentPostId');
        Posts.remove(currentPostId, function(){
          var displayPostConfirmationMessage = function(){
            return function(){
              $('.job-type').text("This post will be deleted shortly!");
              $('.message-container').removeClass('visible-false');
              $('.message-container').addClass('message-container-active');
              setTimeout(function(){
                $('.message-container').removeClass('message-container-active');
                $('.message-container').addClass('visible-false');
                clearTimeout();
              },10000);
            }        
          }
          setTimeout(displayPostConfirmationMessage(), 1000);
          //window.location.href = "/explore/"+Session.get('currentExploreId')+"/home";
          Meteor.Router.to("/explore/"+Session.get('currentExploreId')+"/home");
        });
      }
    }
});


Template.explorePostPageBB.rendered = function(){
  console.log("Explore Post Page Backbone Rendered.");

  if(currentPostId != window.location.pathname.split("/")[4])
  {
    currentPostId = window.location.pathname.split("/")[4];
    pageData = new ExploreData.ExplorePostPage(currentPostId, function(){explorePageDep.changed()});
    pageData.getBubbleTitle(function(){explorePageDep.changed();});
    Meteor.subscribe('comments', currentPostId);
    Session.set("currentPostId", currentPostId);
  }

  if(typeof es === "undefined")
  {
    currentExploreId = window.location.pathname.split("/")[2];
    es = new ExploreData.ExploreSection({
      exploreId: currentExploreId,
      limit: 10,
      fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime', 'commentsCount','attendees']
    });
    es.fetchPage(es.getCurrentPage(), function() {
      Session.set("isLoading", false);
    });
    /*es.explorePosts.on("change", function() {
      console.log("explore posts changed");
      exploreDep.changed();
    });
    es.exploreBubbles.on("change", function() {
      console.log("explore bubbles changed");
      exploreDep.changed();
          Session.set("isLoading", false);
    });
    es.exploreUsers.on("change", function() {
      console.log("explore users changed");
      exploreDep.changed();
          Session.set("isLoading", false);
    });*/
  }
}

Template.explorePostPageBB.created = function() {
  if(typeof currentPostId == "undefined")
  {
    currentPostId = "";
  }
  exploreDep = new Deps.Dependency;
  explorePageDep = new Deps.Dependency;
}

Template.explorePostPageBB.destroyed = function() {
  delete explorePageDep;
}