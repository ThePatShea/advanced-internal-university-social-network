Template.download.events({
    'click .download': function(event) {
      // Disable the parent button
        event.stopPropagation();

      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'File', 'Download', this.name]);
    }
});
