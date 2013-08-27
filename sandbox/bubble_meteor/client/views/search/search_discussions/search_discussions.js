Template.searchDiscussions.helpers({
  /*
  getSearchedDiscussions: function() {
  	return Posts.find(
  		{	postType: 'discussion',
  			$or: [
  			{name: new RegExp(Session.get('searchText'),'i')}, 
  			{body: new RegExp(Session.get('searchText'),'i')}
  			]
  		}, {limit:searchDiscussionsHandle.limit()});
  }
  */
  getSearchedDiscussions: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}},{limit:10});
  },

  typing: function() {
    return Session.get("typing");
  }
});

Template.searchDiscussions.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'discussions');
  
  /*$(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchDiscussions'){
        this.searchDiscussionsHandle.loadNextPage();
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
        Meteor.call('search_discussions', $(".search-text").val(), function(err, res) {
          if(err) {
            console.log(err);
          } else {
            Session.set('typing', 'false');
            Session.set('selectedPostIdList', res);
          }
        });
      }, 500);
    });
  }
  $(".search-btn").bind("click", function(evt) {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      Meteor.call('search_discussions', $(".search-text").val(), function(err, res) {
        if(err) {
          console.log(err);
        } else {
          Session.set('typing', 'false');
          Session.set('selectedPostIdList', res);
        }
      });
    }, 500);
  });
}

Template.searchDiscussions.created = function() {
  mto = "";
  Session.set('typing', 'false');
  Session.set("selectedPostIdList", []);
}

Template.searchDiscussions.events({
  
  "click .search-btn": function(evt){
    Meteor.call('search_discussions', $(".search-text").val(), function(err, res) {
      if(err) {
        console.log(err);
      } else {
        Session.set('typing', 'false');
        Session.set('selectedPostIdList', res);
      }
    });
  }
  
})