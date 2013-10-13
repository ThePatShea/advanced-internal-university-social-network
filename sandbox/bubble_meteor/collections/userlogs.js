//Implementation of intercom
Meteor.settings = {
  INTERCOM_APP_TOKEN : "f6ffd81e9c7f63a3fefb3e9258d110a8ea99bdbc",
  INTERCOM_APP_SECRET : ""
}

var crypto = Npm.require('crypto');
Meteor.users.find({}).forEach(function(user) {
  var hmac = crypto.createHmac('sha256', Meteor.settings.INTERCOM_APP_SECRET);
  Meteor.users.update(user._id, {$set: {
    intercomHashedId: hmac.update(user._id).digest('hex')
  }});
});

Meteor.methods({
  getIntercomToken: function() {
    return Meteor.settings.INTERCOM_APP_TOKEN;
  }
})



//Creation of userlog collection
Userlogs = new Meteor.Collection('userlogs');

Meteor.methods({

  createLog: function(userlog, url){
    //The url has to be passed as a parameter as it is currently 
    //?impossible? for meteor's server side to retreive the url
    //Splitting the url to retrieve page and id
    var urlList = _.reject(url.split('/'), function(obj) {
        return obj == "";
      });

    //Failsafe 
    if(urlList.length == 0) {
      userlog.page = "unknown";
    }
    //Checks if its dashboard or settings
    else if(urlList.length == 1) {
      userlog.page = urlList[0];
    }
    //Checks if its search page
    else if(urlList[0] == 'search') {
      userlog.page = urlList[0] + '-' + urlList[1];
    }
    //Checks if its settings page
    else if(urlList[0] == 'settings') {
      userlog.page = urlList[0] + '-' + urlList[1];
    }
    //Retrieves id for the specific page
    else{
      //Checks if its a bubble and extracts the id
      var objIndex = urlList.indexOf('mybubbles');
      if(objIndex != -1) {
        userlog.bubbleId = urlList[objIndex+1];
        if(urlList.indexOf('edit') != -1) {
          userlog.page = 'mybubbles-edit';
        }else{
          userlog.page = 'mybubbles';
        }
      }
      //Checks if its a post and extracts the id
      objIndex = urlList.indexOf('explore');
      if(objIndex != -1) {
        userlog.exploreId = urlList[objIndex+1];
        userlog.page = 'explore';
      }
      //Checks if its a post and extracts the id
      objIndex = urlList.indexOf('posts');
      if(objIndex != -1) {
        userlog.postId = urlList[objIndex+1];
        if(urlList.indexOf('mybubbles') != -1) {
          userlog.page = 'mybubbles-post';
        }else{
          userlog.page = 'explore-post';
        }
      }
      //Checks if its a editprofile page
      objIndex = urlList.indexOf('edit-profile');
      if(objIndex != -1) {
        userlog.page = 'edit-profile';
      }

      //Checks if its a creation of bubble or explore
      objIndex = urlList.indexOf('create');
      if(objIndex != -1) {
        if(urlList[objIndex+1]){
          userlog.page = 'create-'+urlList[objIndex+1];
        }else{
          userlog.page = 'create-'+urlList[objIndex-1];
        }
        
      }
    }

    //This is a workaround to ensure that creation of post is captured
    if(userlog.overwritePage) {
      userlog.page = userlog.overwritePage;
    }
    
    console.log(userlog);
    var log = _.extend(_.pick(userlog, 
      'page', 'postId', 'bubbleId', 'exploreId', 'action', 'hasLoggedIn'), {
      userId: Meteor.userId(),
      timestamp: new Date().getTime()
    });
    
    log._id = Userlogs.insert(log);
    return log;
  }
});