SearchResults = new Meteor.Collection("searchResults");
Template.bubbleSearch.events({
  'submit form': function(event) {
    event.preventDefault();
    var query = Session.set("query", $(event.target).find('[name=keywords]').val());
   }
});

Template.bubbleSearch.results = function() {
    if (Session.get("query")!=="")
      return Bubbles.find({title: {$regex: Session.get("query"), $options:'i'}});
};

