Template.updatesList.helpers({
  getNumUpdates: function() {
    return Session.get('numUpdates');
  },

//   showMoreUpdates: function(numUpdates) {
//     if(numUpdates && numUpdates > Session.get('numUpdates'))
//       return true;
//     else
//       return false;
//   },

//   numUpdatesMinusThree: function() {
//     var updateList = Updates.find({userId: Meteor.userId(), read:false}).fetch();

//     if(updateList.length > 0) {
//       //To combine updates with same userId, invokerId, updateType and postId
//       _.each(updateList, function(update){
//         updateList = _.reject(updateList, function(newUpdate) {
//           return  update.bubbleId == newUpdate.bubbleId &&
//                   update.userId == newUpdate.userId &&
//                   update.invokerId == newUpdate.invokerId &&
//                   update.updateType == newUpdate.updateType &&
//                   update.postId == newUpdate.postId;
//         });
//         if(!_.contains(updateList,update)){
//           updateList.push(update);
//         }
//       });

//       /**
//       * To combine updates for comments in the same post
//       **/
//       _.each(updateList, function(update){

//         var commentUpdates = _.reject(updateList, function(update) {
//           return update.updateType != "replied";
//         });

//         //Combine and chain the names together
//         if (commentUpdates.length > 0) {
//           updateList = _.reject(updateList, function(newUpdate) {
//             return update.postId == newUpdate.postId &&
//                     update.updateType == newUpdate.updateType &&
//                     update.updateType == "replied";
//           });
//           if(!_.contains(updateList,update)) {
//             //Pull out comment updates that belong to the same post
//             singleTypeUpdates = _.reject(commentUpdates, function(newUpdate) {
//               return update.postId != newUpdate.postId;
//             });
//             if (singleTypeUpdates.length > 0) {
//               //Create the chained name
//               var nameArray = _.pluck(singleTypeUpdates,"invokerName");
//               var chainedName = nameArray.join();
//               var maxLength = 13;

//               //Checks to see if the length of names exceed a certain limit
//               if(chainedName.length > maxLength) {
//                 chainedName = chainedName.substring(0,maxLength);
//                 var nameList = chainedName.split(',');
//                 if(nameArray[0].length > maxLength) {
//                   nameList[0] = nameArray[0];
//                 }else{
//                   nameList.pop();
//                 }
//                 var excessCount = nameArray.length - nameList.length;
//                 chainedName = nameList.join();
//                 if(excessCount == 1) {
//                   chainedName = chainedName + " and " + excessCount + " other";
//                 }else if(excessCount > 1){
//                   chainedName = chainedName + " and " + excessCount + " others";
//                 }
//               }else{
//                 chainedName = chainedName.replace(/,([^,]*)$/," and $1");
//               }

//               //Add the chained name to the invokerName
//               update.invokerName = chainedName;
//             }
//             updateList.push(update);
//           }
//         }
//       });

//       /**
//       *  To combine and chain up names for similar updates
//       **/
//       _.each(updateList, function(originalUpdate) {
//         if(originalUpdate.collapsible == true){
//           var type = originalUpdate.updateType;
//           var singleTypeUpdates = _.reject(updateList, function(update) {
//             return update.updateType != type;
//           });
//           if (singleTypeUpdates.length > 0) {
//             var nameArray = _.pluck(singleTypeUpdates,"invokerName");
//             var chainedName = nameArray.join();
//             var maxLength = 13;

//             if(chainedName.length > maxLength) {
//               chainedName = chainedName.substring(0,maxLength);
//               var nameList = chainedName.split(',');
//               if(nameArray[0].length > maxLength) {
//                 nameList[0] = nameArray[0];
//               }else{
//                 nameList.pop();
//               }
//               var excessCount = nameArray.length - nameList.length;
//               chainedName = nameList.join();
//               if(excessCount == 1) {
//                 chainedName = chainedName + " and " + excessCount + " other";
//               }else{
//                 chainedName = chainedName + " and " + excessCount + " others";
//               }
//             }else{
//               chainedName = chainedName.replace(/,([^,]*)$/," and $1");
//             }

//             originalUpdate.invokerName = chainedName;
//             // Next remove all applicants
//             updateList = _.reject(updateList, function(newUpdate) {
//               return newUpdate.updateType == type;
//             });
//             //Now add back with the applicant that has a changed invoker name
//             if(firstUpdate){
//               updateList.push(firstUpdate);
//             }
//           }
//         }
//       });

//       return (updateList.length - Session.get('numUpdates'));
//     }
//   }
});