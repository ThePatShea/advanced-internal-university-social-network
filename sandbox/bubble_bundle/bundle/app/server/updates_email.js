if(Meteor.isServer){
  Meteor.methods({
    sendEmail: function (to, subject, updateList) {
      // check([to, subject, updateList.toString()], [String]);

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();
      Email.send({
        to: to,
        from: "no-reply@emorybubble.com",
        subject: subject,
        html: _.toArray(updateList).toString()
      });
      console.log("An email is sent to " + to);
      Updates.update({read:false, emailed:false}, {$set:{emailed:true}});
    }
  });
  
  Meteor.startup(function () {
    process.env.MAIL_URL = 'smtp://no-reply%40thecampusbubble.com:u3nT8dAC@smtp.gmail.com:465/';

    Meteor.setInterval(function(){
      //Checks if its 8am of Monday
      if(moment().day() == 1 && moment().hours() == 8 
        && moment().minutes() == 0 && moment().seconds() == 0){
        /**
        * Updates are compiled and compressed into a dictionary object with 3 layers
        * 1st layer - UserId
        * 2nd layer - BubbleId  -- E.g. 1 userId has multiple bubbleId
        * 3rd layer - Updates -- E.g. 1 bubbleId has multiple updates
        **/

        var fullUpdateList = compressUpdates();
        //Pulling the userId out for the 1st layer
        var userIdList = Object.keys(fullUpdateList);
        _.each(userIdList, function(userId){
          var emailUpdateList = {};
          var bubbleUpdateList = fullUpdateList[userId];
          //Pulling the bubbleId out for the 2nd layer
          var bubbleIdList = Object.keys(bubbleUpdateList);
          //Iterate through the 3rd layer of updates
          _.each(bubbleIdList, function(bubbleId){
            var updateList = bubbleUpdateList[bubbleId]; 
            //Edit the content for update types that does compiling
            var bubbleUpdateTypeList = 
              [ 
                "new applicant",
                "new attendee",        
                "member promoted",
                "member demoted",
                "joined bubble"
              ]
            _.each(updateList, function(update){
              if(update.updateType == 'replied'
                || _.contains(bubbleUpdateTypeList,update.updateType)) {
                update.content = update.invokerName + update.content;
              }
            });
            var contentList = _.pluck(updateList,'content');
            var bubble = Bubbles.findOne(bubbleId);
            emailUpdateList[bubble.title] = contentList;
          });
          var user = Meteor.users.findOne(userId);
          Meteor.call('sendEmail',  user.emails[0].address , 'Weekly Updates', emailUpdateList);
        });
      }
    },1000);
  });
}

compressUpdates = function() {
  var fullUpdateList = Updates.find({read: false, emailed: false }).fetch();
  var userUpdateList = _.toArray(_.groupBy(fullUpdateList,'userId'));
  var finalUpdateDic = {};

  _.each(userUpdateList, function(updateList){
    var userId = updateList[0].userId;
    //To combine updates with same userId, invokerId, updateType and postId
    if(updateList.length > 0) {
      //To combine updates with same userId, invokerId, updateType and postId
      _.each(updateList, function(update){
        updateList = _.reject(updateList, function(newUpdate) {
          return  update.bubbleId == newUpdate.bubbleId && 
                  update.userId == newUpdate.userId && 
                  update.invokerId == newUpdate.invokerId && 
                  update.updateType == newUpdate.updateType &&
                  update.postId == newUpdate.postId;
        });
        if(!_.contains(updateList,update)){
          updateList.push(update);
        }
      });

      /**
      * To combine updates for comments in the same post
      **/
      _.each(updateList, function(update){

        var commentUpdates = _.reject(updateList, function(update) {
          return update.updateType != "replied";
        });

        //Combine and chain the names together
        if (commentUpdates.length > 0) {
          updateList = _.reject(updateList, function(newUpdate) {
            return update.postId == newUpdate.postId && 
                    update.updateType == newUpdate.updateType &&
                    update.updateType == "replied";
          });
          if(!_.contains(updateList,update)) {
            //Pull out comment updates that belong to the same post
            singleTypeUpdates = _.reject(commentUpdates, function(newUpdate) {
              return update.postId != newUpdate.postId;
            });
            if (singleTypeUpdates.length > 0) {
              //Create the chained name
              var nameArray = _.pluck(singleTypeUpdates,"invokerName");
              var chainedName = nameArray.join();
              var maxLength = 13;

              //Checks to see if the length of names exceed a certain limit
              if(chainedName.length > maxLength) {
                chainedName = chainedName.substring(0,maxLength);
                var nameList = chainedName.split(',');
                if(nameArray[0].length > maxLength) {
                  nameList[0] = nameArray[0];
                }else{
                  nameList.pop();
                }
                var excessCount = nameArray.length - nameList.length;
                chainedName = nameList.join();
                if(excessCount == 1) {
                  chainedName = chainedName + " and " + excessCount + " other";
                }else if(excessCount > 1){
                  chainedName = chainedName + " and " + excessCount + " others";
                }
              }else{
                chainedName = chainedName.replace(/,([^,]*)$/," and $1");
              }

              //Add the chained name to the invokerName
              update.invokerName = chainedName;
            }
            updateList.push(update);
          }
        }
      });

      //Declaring the types that needs collapsing of names
      var bubbleUpdateList = 
      [ 
        "new applicant",
        "new attendee",        
        "member promoted",
        "member demoted",
        "joined bubble"
      ]

      /**
      *  To combine and chain up names for compressed updates
      **/
      _.each(bubbleUpdateList, function(type) {
        var singleTypeUpdates = _.reject(updateList, function(update) {
          return update.updateType != type;
        });
        if (singleTypeUpdates.length > 0) {
          var nameArray = _.pluck(singleTypeUpdates,"invokerName");
          var chainedName = nameArray.join();
          var maxLength = 13;

          if(chainedName.length > maxLength) {
            chainedName = chainedName.substring(0,maxLength);
            var nameList = chainedName.split(',');
            if(nameArray[0].length > maxLength) {
              nameList[0] = nameArray[0];
            }else{
              nameList.pop();
            }
            var excessCount = nameArray.length - nameList.length;
            chainedName = nameList.join();
            if(excessCount == 1) {
              chainedName = chainedName + " and " + excessCount + " other";
            }else{
              chainedName = chainedName + " and " + excessCount + " others";
            } 
          }else{
            chainedName = chainedName.replace(/,([^,]*)$/," and $1");
          }

          //First retrieve applicant
          var firstUpdate = _.find(updateList, function(update) {
            update.invokerName = chainedName;
            return update.updateType == type
          });
          // Next remove all applicants
          updateList = _.reject(updateList, function(newUpdate) {
            return newUpdate.updateType == type;
          });
          //Now ad back with the applicant that has a changed invoker name
          if(firstUpdate){
            updateList.push(firstUpdate);
          }
        }
      });

      updateList = _.sortBy(updateList, function(newUpdate) {
        return newUpdate.submitted; 
      }); 

      finalUpdateDic[userId] = _.groupBy(updateList,'bubbleId');
    }
  });
  return finalUpdateDic;
}