Flags = new Meteor.Collection('flags');

Meteor.methods({
  createFlag: function(flagAttributes){
    var user = Meteor.user();
   
    var flag = _.extend(_.pick(flagAttributes, 
      'postId', 'commentId', 'bubbleId', 'invokerId',
      'invokerName'), {
      submitted: new Date().getTime(),
      solved: false
    });
    var flagId = Flags.insert(flag);
    return flagId;
  	// console.log(Meteor.users.find({userType:'superuser'}));
  },
  resolveFlag: function(flagId){
  	Flags.update({_id: flagId}, {$set: {solved: true}});

  }
});