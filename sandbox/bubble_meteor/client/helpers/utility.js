
createObject = function(postAttributes, objName, location){
	Meteor.call(objName, postAttributes, function(error, id) {
    if (error) {
      // display the error to the user
      throwError(error.reason);
    } else {
      Meteor.Router.to(location, id);
    }
  });
}