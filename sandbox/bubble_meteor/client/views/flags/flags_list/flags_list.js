Template.flagsList.helpers({
  getUnsolvedFlags: function() {
    return Flags.find({solved:false}, {limit: unsolvedFlagsHandle.limit()});
  },
  getSolvedFlags: function() {
    return Flags.find({solved:true}, {limit: solvedFlagsHandle.limit()});
  }
});
