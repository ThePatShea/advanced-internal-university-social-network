Template.download.events({
    'click .download': function(event) {
      // Disable the parent button
        event.stopPropagation();

      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'File', 'Download', this.name]);

      // Add to the numDownloads count
        Posts.update(this._id, {$set: {lastDownloadTime: new Date().getTime()}, $inc: {numDownloads: 1} }, function(error) {
          if (error) {
            // display the error to the user
            throwError(error.reason);
          } else {
            Meteor.Router.to('postPage', currentPostId);
          }
        });
    }
});
