Template.searchFiles.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchFilesMeteor(searchText, function(err, res) {
        if (!err) {
          var fileIds = res;
          Session.set('selectedFileIdList', fileIds);
        }
      });
    }
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    SearchHelpers.searchFilesMeteor(searchText, function(err, res) {
      if (!err) {
        var fileIds = res;
        Session.set('selectedFileIdList', fileIds);
      }
    });
  }
});

Template.searchFiles.helpers({
  getSearchedFiles: function() {
    return Posts.find({_id: {$in: Session.get('selectedFileIdList')}},{limit:10});
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchFiles.created = function() {
  Session.set("selectedFileIdList", []);
}



Template.searchFiles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'files');
  $(document).attr('title', 'Search Files - Emory Bubble');
}
