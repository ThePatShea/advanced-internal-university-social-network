Template.loggedOut.rendered = function() {
  setTimeout(function(){
    Meteor.Router.to("welcomePage");
  },60000)
}
