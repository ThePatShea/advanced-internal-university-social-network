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
    console.log(flag);
    var flagId = Flags.insert(flag);

    //Flags the specific post
    Posts.update({_id: flag.postId}, {$set: {flagged: true}});
    // Creates the update when the flag object is created
    createPostFlagUpdate(flag);

    return flag;
  },
  resolveFlag: function(flag){
  	Flags.update({_id: flag._id}, {$set: {solved: true}});
    Posts.update({_id: flag.postId}, {$set: {flagged: false}});
  }
});