Template.flagsList.helpers({
  getUnsolvedFlags: function() {
    return Flags.find({solved:false}, {limit: unsolvedFlagsHandle.limit()});
  },
  getSolvedFlags: function() {
    return Flags.find({solved:true}, {limit: solvedFlagsHandle.limit()});
  }
});

Template.flagsList.events({
  'click .resolve-flag': function() {
    if (confirm("Solve this flag?")) {
      createPostUnflagUpdate(this);
      Meteor.call('resolveFlag',this);
    }
  }
});
