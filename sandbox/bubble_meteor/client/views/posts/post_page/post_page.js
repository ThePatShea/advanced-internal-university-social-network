Template.postPage.events({
  'click .flag': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Flagging', 'Flag', +this.name]);
    if (confirm("Flag this post?")) {
      var flagAttributes = {
        postId: this._id,
        bubbleId: this.bubbleId,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
      }
      Meteor.call('createFlag',flagAttributes);
    }
  }
});
