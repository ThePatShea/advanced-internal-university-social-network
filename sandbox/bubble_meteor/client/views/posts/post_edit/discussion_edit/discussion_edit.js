Template.discussionEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Edit Discussion', this.name]);
    
    var currentPostId = Session.get('currentPostId');
    var currentBubbleId = Session.get('currentBubbleId');
    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    var currentpost = Posts.findOne({_id: currentPostId});
    var currentChildren = currentpost.children;
    console.log('Current children: ', currentChildren);
    var newChildren = [];
    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = (function(f){
        return function(e) {
          //console.log("Edit discussion: ", f.name);
          
          var filePostAttributes = {
            name: escape(f.name),
            file: e.target.result,
            fileType: f.type,
            postType: 'file',
            parent: currentPostId,
            bubbleId: currentBubbleId
          };
          Meteor.call('post', filePostAttributes, function(error, newFilePost){
            if(error){
              throwError(error.reason);
            }
            else{
              console.log("Discussion edit new filepost id: ", newFilePost._id);
              //newChildren.push(newFilePost._id);
              var parentId = newFilePost.parent;
              var parentpost = Posts.findOne({_id: parentId});
              var updatedchildren = parentpost.children;
              updatedchildren.push(newFilePost._id);
              console.log('Updated children: ', updatedchildren);
              var parentPostAttributes = {
                children: updatedchildren
              };
              Posts.update(parentId, {$addToSet: {children: {$each: updatedchildren} }}, function(error){
                if(error){
                  throwError(error.reason);
                }
              });
            }
          });
        }
      })(f);
      reader.readAsDataURL(f);
    };


    console.log('Removed: ', removed);
    console.log('Current: ', currentChildren);

    for(var i=0; i < currentChildren.length; i++){
      var removeIt = false;
      for(var j=0; j < removed.length; j++){
        if(currentChildren[i] == removed[j]){
          removeIt = true;
          break;
        }
      }
      if(removeIt == false){
        newChildren.push(currentChildren[i]);
      }
    }
    console.log('newChildren: ', newChildren)

    var updatedPostProperties = {
      children: newChildren,
      name: $(e.target).find('[name=name]').val(),
      body: $(e.target).find('.wysiwyg').html()
    };

    Posts.update(currentPostId, {$set: updatedPostProperties}, function(error){
      if(error){
        throwError(error.reason);
      }
      else{
        Meteor.Router.to('postPage', currentBubbleId, currentPostId);
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
