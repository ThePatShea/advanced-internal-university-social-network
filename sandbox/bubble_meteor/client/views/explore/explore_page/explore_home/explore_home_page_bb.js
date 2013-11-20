//the events past 4 hours will not be listed on the event page
referenceDateTime = moment().add('hours',-4).valueOf();

Template.explorePageBB.created = function(){
  var currentExploreId = window.location.pathname.split("/")[2];
  BPost = Backbone.Model.extend({
    url: function() {
      return "http://localhost:3000/2013-09-11/posts/"+this.id;
    }
  });
  BPosts = Backbone.Collection.extend({
    model: BPost,
    url: function() {
      return "http://localhost:3000/2013-09-11/explores/gzbHkAnBGQqK26FRT/posts";
    },

    parse: function(response){
      var listObjects = [];
      _each(response.posts, function(item){listObjects.push(item);});
      return listObjects;
    },

    /*,
    parse: function(response) {
      var listSource = new Array();
      _.each(response.posts, function(element, index, list) {
        console.log("Parsing: ", element.name);
        listSource.push(new BPost( {
          "id": element._id,
          "name": element.name
        }));
      });
      return listSource;
    }*/
  });

  BBBubble = Backbone.Model.extend({
    url: function() {
      return "/2013-09-11/bubbles/"+this.attributes._id;
    }
  });

  BBubble = Backbone.Model.extend({
    url: function() {
      console.log("THIS: ", this);
      return "/2013-09-11/bubbles/"+this.attributes._id;
    }
  });
  BBubbles = Backbone.Collection.extend({
    model:BBubble,
    url: function() {
      return "/2013-09-11/bubbles?fields=title,category";
    }
  });

  bbubbles = new BBubbles();
  bbubbles.fetch({"async": false, "success": function(collection, response) {
    console.log("success");
    console.log("Bubble Collection: ", collection);
    console.log("Bubble Response: ", response);
  }});

  bposts = new BPosts();
  bposts.fetch({"async": false, "success": function(collection, response) {
    console.log("success");
    console.log("Post Collection: ", collection);
    console.log("Post Response: ", response);
  }});
  max_scrolltop = 100;
  virtualPage = 0;
  //console.log('Explore Page Created');
  postIds = [];
  Meteor.subscribe('currentExplorePostIds', currentExploreId, function(){
    console.log('Explore Page Created: ', currentExploreId, Posts.find({exploreId: currentExploreId}).fetch());
    posts = Posts.find({exploreId: currentExploreId}).fetch()
    postIds = _.pluck(posts, "_id");
    virtualPagePostIds = postIds.slice(0, 10);
  });
}


Template.explorePageBB.rendered = function(){
  var currentExploreId = window.location.pathname.split("/")[2];
  console.log('Explore Page Rendered: ', currentExploreId, Posts.find({exploreId: currentExploreId}).fetch());
  //var posts = Posts.find({exploreId: currentExploreId}).fetch();
  //var postIds = _.pluck(posts, "_id");
  //Meteor.subscribe('findExplorePostsById', virtualPagePostIds);
  LoadingHelper.start();
  Meteor.subscribe('currentExplorePostIds', currentExploreId, function(){
    console.log('Explore Page Created: ', currentExploreId, Posts.find({exploreId: currentExploreId}).fetch());
    posts = Posts.find({exploreId: currentExploreId}).fetch()
    postIds = _.pluck(posts, "_id");
    virtualPagePostIds = postIds.slice(0, 10)
    Meteor.subscribe('findExplorePostsById', virtualPagePostIds, function() {
      LoadingHelper.stop();
      console.log("DONE");
    });
  });
  //console.log('Post Ids: ', postIds);

  $("#main").scroll(function(){
    console.log('Scrolltop, mainheight, documentheight, windowheight: ', $("#main").scrollTop(), $("#main").height(), $(document).height(), $(window).height());
      if($("#main").scrollTop() > max_scrolltop){
        //console.log('Pre paginating: ', virtualPage, $("#main").scrollTop(), $("#main").height(), $(document).height());
        //console.log('Scrolling: ', virtualPage, userIds.slice(oldpage*10, page*10));
        max_scrolltop = $("#main").scrollTop() + 200;
        virtualPage = virtualPage + 1;
        //var pageUserIds = userIds.slice((page)*5, (page+1)*5);
        //Meteor.subscribe('findUsersById', pageUserIds);
        var virtualPagePostIds = postIds.slice((virtualPage)*10, (virtualPage+1)*10);
        Meteor.subscribe('findExplorePostsById', virtualPagePostIds);
        //console.log('Paginating: ', (virtualPage)*10, (virtualPage+1)*10);
        //console.log('Explore post Ids: ', virtualPagePostIds);
        //console.log('End of Page');
      }

    });

}

Template.explorePageBB.helpers({
  currentExplore: function(){
    var currentExploreId = Session.get('currentExploreId');
    var currentExplore = Explores.findOne({_id: currentExploreId});
    return currentExplore;
  },

  //Get posts assigned to this bubble
  eventsCount: function() {
    return Meteor.call('getNumOfEvents','event');
  },
  discussionsCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
  },
  filesCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
  },

  // check if there are more posts to view
  hasMoreEvents: function() {
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event', dateTime: {$gt: referenceDateTime}}).count() - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },
  hasMoreDiscussions: function() {
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },
  hasMoreFiles: function() {
    var num = Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
    if (num > 0){
      return true;
    }else{
      return false;
    }
  },

  // return only latest 3 posts
  filePosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'},{limit: 3}).fetch();
  },

  /*posts: function() {
    var explore = Explores.findOne(Session.get('currentExploreId'));
    var posts = Posts.find({exploreId: Session.get('currentExploreId'), postType: explore.exploreType}, {sort: {lastCommentTime:  -1} }).fetch();
    var validPostIds = [];
    for(var i=0; i < posts.length; i++){
      var postAsId = posts[i].postAsId;
      //console.log('Post as id: ', posts[i].postAsId, ((Bubbles.find({_id: postAsId}).count() > 0) || (Meteor.users.find({_id: postAsId}) > 0)));
      if((Bubbles.find({_id: postAsId}).count() > 0) || (Meteor.users.find({_id: postAsId}).count() > 0)){
        validPostIds.push(posts[i]._id);
      }
    }
    //console.log('Valid post ids: ', validPostIds);

    //return Posts.find({exploreId: Session.get('currentExploreId'), postType: explore.exploreType}, {sort: {lastCommentTime:  -1} });
    return Posts.find({_id: {$in: validPostIds}, postType: explore.exploreType}, {sort: {lastCommentTime: -1}});
  }*/
  posts: function() {
    var posts = bposts.toJSON();
    console.log("POSTS: ",posts);
    return posts[0].posts;
  }

});

Template.explorePageBB.events({
  'btn .clear-updates': function() {
    Meteor.call('clearUpdates', Session.get('currentBubbleId'));
  }
});
