Template.loginPage.events({
  'submit form': function(event) {
    event.preventDefault();
    //Google Analytics
    // _gaq.push(['_trackEvent', 'Post', 'Create Discussion', $(event.target).find('[name=name]').val()]);
    

    var username = $(event.target).find('[name=username]').val()
    var password = $(event.target).find('[name=password]').val()

    Meteor.loginWithPassword(username, password, function(err) {
      if(err){
        //Do something with error
      }else{
        var bubbles = Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).fetch();
        if(bubbles.length > 0) {
          Meteor.Router.to('bubblePage',bubbles[0]._id);
        }else{
          Meteor.Router.to('searchBubbles',bubbles[0]._id);
        }
      }
    })
        
  }
});
