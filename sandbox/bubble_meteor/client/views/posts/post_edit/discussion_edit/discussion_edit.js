Template.discussionEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Edit Discussion', this.name]);
    
    var currentPostId = Session.get('currentPostId');
    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    var currentpost = Posts.findOne({_id: currentPostId});
    var currentChildren = currentpost.children;
    var newChildren = [];
    console.log('Current Children: ',currentChildren);
    console.log('Removed: ', removed);
    for(var i = 0; i < currentChildren.length; i++){
      for(var j = 0; j < removed.length; j++){
        console.log('Should I remove: ', currentChildren[i], removed[j]);
        if(currentChildren[i] == removed[j]){
          console.log('Removing: ', removed[j]);
          Posts.remove({_id: removed[j]});
        }
        else{
          newChildren.push(currentChildren[i]);
        }
      }
    }
    console.log('New Children: ', newChildren);

    var postProperties = {
      dateTime: dateTime,
      name: $(e.target).find('[name=name]').val(),
      body: $(e.target).find('.wysiwyg').html(),
      children: newChildren,
      lastUpdated: new Date().getTime()
    }

    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('postPage', currentPostId);
      }
    });
  },
  
  'click .delete': function(e) {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Delete Discussion', this.name]);
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      Posts.remove(currentPostId);
      Meteor.Router.to('bubblePage',Session.get('currentBubbleId'));
    }
  }
});
