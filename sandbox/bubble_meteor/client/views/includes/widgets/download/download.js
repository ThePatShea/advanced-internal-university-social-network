Template.download.events({
    'click .download': function(event) {
      // Disable the parent button
        event.stopPropagation();
        //event.preventDefault();

        if(typeof this.id == 'undefined'){
          this.id = this._id;
        }

        currentPostObject = new BubbleData.BubblePost({id: this.id});
        currentPostObject.fetch({async: false});
        currentPost = currentPostObject.toJSON();
        $("#" + this.id).attr('href', currentPost.file);
        //console.log('Download: ', currentPost);
        //console.log('Download: ', $("#" + this.id).attr('href'));


      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'File', 'Download', this.name]);

      // Add to the numDownloads count
        Posts.update({_id: this.id}, {$set: {lastDownloadTime: new Date().getTime()}, $inc: {numDownloads: 1} }, function(error) {
          if (error) {
            // display the error to the user
            throwError(error.reason);
            console.log('Error updating post: ', error);
          } else {
            //Meteor.Router.to('postPage', currentPostId);
            console.log('Updating post download time');
          }
        });

        //window.open(currentPost.file,'_.blank');
    }
});
