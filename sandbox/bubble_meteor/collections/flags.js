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
    //Flags the specific post
    Posts.update({_id: flag.postId}, {$set: {flagged: true}});
    console.log(flag);
    return flag;
  },
  resolveFlag: function(flag){
  	Flags.update({_id: flagId}, {$set: {solved: true}});
  }
});