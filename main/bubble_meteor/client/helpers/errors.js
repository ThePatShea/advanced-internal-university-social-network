// Local (client-only) collection
Errors = new Meteor.Collection(null);

throwError = function(message) {
  Errors.insert({message: message, seen: false});
  console.log(message);
}

clearErrors = function() {
  Errors.remove({seen: true});
}
