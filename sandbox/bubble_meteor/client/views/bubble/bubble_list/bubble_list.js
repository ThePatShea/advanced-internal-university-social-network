Template.bubblesList.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      this.newPostsHandle.loadNextPage();
    }
  });
}