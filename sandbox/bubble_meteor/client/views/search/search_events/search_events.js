Template.searchEvents.helpers({
  
  /*
  getSearchedEvents: function() {
  	return Posts.find(
  		{	postType: 'event',
  			$or: [
  			{name: new RegExp(Session.get('searchText'),'i')}, 
  			{body: new RegExp(Session.get('searchText'),'i')},
  			{location: new RegExp(Session.get('searchText'),'i')}
  			]
  		}, {limit: searchEventsHandle.limit()});
  }
  */
  getSearchedEvents: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}},{limit:10});
  },

  typing: function() {
    return Session.get("typing");
  }
});

Template.searchEvents.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'events');
  
  /*
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchEvents'){
        this.searchEventsHandle.loadNextPage();
      }
    }
  });
  */
  if($(window).width() > 768)
  {
    $(".search-text").bind("keydown", function(evt) {
      Session.set('typing', 'true');
    });
    $(".search-text").bind("propertychange keyup input paste", function(evt) {
      Meteor.clearTimeout(mto);
      mto = Meteor.setTimeout(function() {
        Meteor.call('search_events', $(".search-text").val(), function(err, res) {
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
      Meteor.call('search_events', $(".search-text").val(), function(err, res) {
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

Template.searchEvents.created = function() {
  mto = "";
  Session.set('typing', 'false');
  Session.set("selectedPostIdList", []);
}

Template.searchEvents.events({
  /*
  "click .search-btn": function(evt){
    Meteor.call('search_events', $(".search-text").val(), function(err, res) {
      if(err) {
        console.log(err);
      } else {
        Session.set('typing', 'false');
        Session.set('selectedPostIdList', res);
      }
    });
  }
  */
})