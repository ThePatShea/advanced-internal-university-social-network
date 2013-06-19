Template.bubbleInvitation.helpers({
  findUsers: function(){
    return Meteor.users.find();
  }
});

Template.bubbleInvitation.events({
  'submit form': function(e) {
    e.preventDefault();
    //store the content into the session
		Session.set('selectedUsername', $(e.target).find('[name=title]').val()); 
    Session.set('currentUserId', Meteor.userId());
  },	
});

Template.bubbleInvitation.rendered = function() {

  //Format the searchfield when the textbox is changed
  $(".search-text").change(function(){
    var searchText = $(".search-text").val();
    $(".search-field").val(searchText);
  });

}
