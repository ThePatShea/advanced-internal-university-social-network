Template.updateItem.helpers({
  getNewCommentsCount: function() {
    return Updates.find({postId:this.postId, updateType:'replied', userId: Meteor.userId(), read:false}).count();
  },
  getContentTitle: function() {
    switch (this.updatType) {
      case 'joined bubble':
      case 'member promoted':
      case 'member demoted':
      case 'new applicant':
        return 'Member List';
      case 'new attendee':
      case 'replied':
      case 'posted':
      case 'edited post':
        return this.post && this.postData.name;
      case 'removed from bubble':
      case 'application rejected':
        return 'Bubble List';
      default:
        return 'Dismiss Update';
    }
  },
  getDisplayInfo: function() {
    if(this.updateType === 'new attendee' ||
       this.updateType === 'edited post' ||
       this.updateType === 'replied' ||
       this.updateType === 'posted') {
      return this.postData;
    } else {
      var object = { };

      if (this.userData)
        object.name = this.userData.name;
      else
        object.name = this.invokerName;

      object.postType  =  'member';
      return object;
    }
  },
  getProfilePicture: function() {
    return this.userData && this.userData.profilePicture;
  }
});

Template.updateItem.events({
  'click .update-item': function() {
    Meteor.Router.to(this.url, this.bubbleId, this._id);
    Meteor.call('setRead', this);
  }
});
