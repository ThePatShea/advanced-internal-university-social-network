Template.searchBubbles.helpers({
  /*getSearchedBubbles: function() {
    if(Session.get('searchText')){
      return Bubbles.find(
        { $or: [
          {title: new RegExp(Session.get('searchText'),'i')}, 
          {description: new RegExp(Session.get('searchText'),'i')}
          ]
        }, {limit:searchBubblesHandle.limit()});
    }else{
      return Bubbles.find({}, {limit: mainBubblesHandle.limit()});
    }
  }*/
  getSearchedBubbles: function() {
    var bubbles = Bubbles.find({_id: {$in: Session.get('selectedBubbleIdList')}},{limit:10}).fetch();
    _.each(bubbles,function(bubble){
      console.log("BUBBLES: ",bubbles, " | BUBBLE: ", bubble);
      bubble.id = bubble._id;
    });
    return bubbles;
  },
  typing: function() {
    return Session.get("typing");
  },
});

Template.searchBubbles.created = function() {
  mto = "";
  Session.set('typing', 'false');
  Session.set("selectedBubbleIdList", []);
}

Template.searchBubbles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'bubbles');

  /*
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchBubbles'){
        if(Session.get('searchText')){
          this.searchBubblesHandle.loadNextPage();
        }else{
          this.mainBubblesHandle.loadNextPage();
        }
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
        Meteor.call('search_bubbles', $(".search-text").val(), function(err, res) {
          if(err) {
            console.log(err);
          } else {
            Session.set('typing', 'false');
            Session.set('selectedBubbleIdList', res);
          }
        });
      }, 500);
    });
  }
  $(".search-btn").bind("click", function(evt) {
    Meteor.clearTimeout(mto);
    mto = Meteor.setTimeout(function() {
      Meteor.call('search_bubbles', $(".search-text").val(), function(err, res) {
        if(err) {
          console.log(err);
        } else {
          Session.set('typing', 'false');
          Session.set('selectedBubbleIdList', res);
        }
      });
    }, 500);
  });
  $(document).attr('title', 'Search Bubbles - Emory Bubble');
}

Template.searchBubbles.events({
  
  /*"click .search-btn": function(evt){
    Meteor.call('search_bubbles', $(".search-text").val(), function(err, res) {
      if(err) {
        console.log(err);
      } else {
        Session.set('typing', 'false');
        Session.set('selectedBubbleIdList', res);
      }
    });
  }*/
})