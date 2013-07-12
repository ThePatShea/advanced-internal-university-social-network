Userlogs = new Meteor.Collection('userlogs');

// Meteor.methods({
//   createLog: function(page){
//     var timestamp = Meteor.user().lastActionTimeStamp;
//     console.log(timestamp - new Date().getTime());
//     // var loggedIn = false;
//     // if(timestmap - new Date().getTime() ) {

//     // }
//     var log = {
//       submitted: new Date().getTime(),
//       userId: Meteor.userId(),
//       page: Meteor.Router.page(),
//       hasLogin: 1
//     }
//     var logId = Userlogs.insert(log);
//     Meteor.call('updateLastTimeStamp');
//     // console.log(Userlogs.find().count());
//     return logId;
//   }
// });