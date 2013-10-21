Template.searchFiles.helpers({

  /*
  getSearchedFiles: function() {

  	var posts =  Posts.find(
  		{	postType: 'file',
        bubbleId: {$exists: true},
  			name: new RegExp(Session.get('searchText'),'i')
  		}, {limit: searchFilesHandle.limit() }).fetch();

    // return posts where searchText is not similar to file extension
    if(posts) {
      return _.reject(posts, function(post) { 
        nameList = post.name.split('.');
        if(nameList.length>1) {
          return nameList[nameList.length-1].match(new RegExp(Session.get('searchText'), 'i'));
        }
      });
    }
  }*/
  getSearchedFiles: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}},{limit:10});
  },

  typing: function() {
    return Session.get("typing");
  }
});

Template.searchFiles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'files');

  /*$(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchFiles'){
        this.searchFilesHandle.loadNextPage();
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
        Meteor.call('search_files', $(".search-text").val(), function(err, res) {
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
      Meteor.call('search_files', $(".search-text").val(), function(err, res) {
        if(err) {
          console.log(err);
        } else {
          Session.set('typing', 'false');
          Session.set('selectedPostIdList', res);
        }
      });
    }, 500);
  });
  $(document).attr('title', 'Search Files - Emory Bubble');
}

Template.searchFiles.created = function() {
  mto = "";
  Session.set('typing', 'false');
  Session.set("selectedPostIdList", []);
}

Template.searchFiles.events({
  /*
  "click .search-btn": function(evt){
    Meteor.call('search_files', $(".search-text").val(), function(err, res) {
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