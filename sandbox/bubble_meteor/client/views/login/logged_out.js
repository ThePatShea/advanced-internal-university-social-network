Template.loggedOut.rendered = function() {
  setTimeout(function(){
    Meteor.Router.to("welcome");
  },60000)
}
