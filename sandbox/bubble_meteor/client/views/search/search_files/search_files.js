Template.searchFiles.helpers({
  hasSearchText: function() {
  	if(Session.get('searchText') != undefined){
  		return true;
  	}
  },
  getSearchedFiles: function() {

  	var posts =  Posts.find(
  		{	postType: 'file',
  			name: new RegExp(Session.get('searchText'),'i')
  		}, {limit: fileListHandle.limit() }).fetch();

    // return posts where searchText is not similar to file extension
    if(posts) {
      return _.reject(posts, function(post) { 
        nameList = post.name.split('.');
        if(nameList.length>1) {
          return nameList[nameList.length-1].match(new RegExp(Session.get('searchText'), 'i'));
        }
      });
    }
  }
});

Template.searchFiles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'files');

  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchFiles'){
        this.fileListHandle.loadNextPage();
      }
    }
  });
}