Template.searchFiles.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchFilesREST(searchText, function(err, res) {
        if (!err) {
          var files = res;
          Session.set('selectedFileList', files);
        }
      });
    }
    LoadingHelper.stop();
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    SearchHelpers.searchFilesREST(searchText, function(err, res) {
      if (!err) {
        var files = res;
        Session.set('selectedFileList', files);
      }
    });
    LoadingHelper.stop();
  }
});

Template.searchFiles.helpers({
  getSearchedFiles: function() {
    return Session.get('selectedFileList');
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchFiles.created = function() {
  Session.set("selectedFileList", []);
}



Template.searchFiles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'files');
  $(document).attr('title', 'Search Files - Emory Bubble');
}
