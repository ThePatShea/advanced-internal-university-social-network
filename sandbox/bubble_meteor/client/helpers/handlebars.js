Handlebars.registerHelper('pluralize', function(n, thing, between) {
  if (between == undefined)
    between = ''

  thing = between + ' ' + thing

  // Fairly simple pluralizer
  if(thing == 'person'){
    if (n === 1) {
      return '1 ' + 'person';
    } else {
      return n + ' people';
    }
  }else{
    if (n === 1) {
      return '1 ' + thing;
    } else {
      return n + ' ' + thing + 's';
    }
  }
});

var getPosts = function(inputPostType) {
  var params_find  =  {bubbleId: Session.get('currentBubbleId'), postType: inputPostType}

  if (inputPostType == 'event') {
    params_find.dateTime  =  {$gt: moment().add('hours',-4).valueOf()}
    var params_sort       =  {dateTime:     1}
  } else if (inputPostType == 'file') {
    var params_sort       =  {lastDownloadTime: -1}
  } else {
    var params_sort       =  {lastCommentTime:  -1}
  }

  return Posts.find(params_find, {limit: 3, sort: params_sort}).fetch();
}

Handlebars.registerHelper('getUserTypeName', function(userType){
  return userTypes[userType];
});

Handlebars.registerHelper('postProperties', {
    discussion : {
        posts      : function() { return getPosts('discussion'); }
      , postType   : 'discussion'
      , word1      : 'active'
    }
  , event      : {
        posts      : function() { return getPosts('event'); }
      , postType   : 'event'
      , word1      : 'upcoming'
    }
  , file       : {
        posts      : function() {
          var posts = getPosts('file');
          
          // Updates missing fields, if necessary
          _.each(posts, function(post) {
            if (!post.numDownloads || !post.lastDownloadTime) {
              if (!post.lastDownloadTime)
                post.lastDownloadTime = new Date().getTime();
                
              if (!post.numDownloads)
                post.numDownloads = 0;

              Posts.update(
                  {_id : post._id}
                , {$set: {
                      lastDownloadTime : post.lastDownloadTime
                    , numDownloads     : post.numDownloads
                  } 
              });
            }
          });

          return posts;
        }
      , postType   : 'file'
      , word1      : 'latest'
    }
});

Handlebars.registerHelper('matchPostType', function(inputPostType) {
  return this.postType == inputPostType;
});

Handlebars.registerHelper('matchObjectType', function(inputObjectType){
  if(inputObjectType == 'post'){
    if(typeof this.postType != 'undefined'){
      return true;
    }
    else{
      return false;
    }
  }
  else if(inputObjectType == 'bubble'){
    if(typeof this.category != 'undefined'){
      return true;
    }
    else{
      return false;
    }
  }
  else if(inputObjectType == 'user'){
    if(typeof this.userType != 'undefined'){
      return true;
    }
    else{
      return false;
    }
  }
  else{
    return false;
  }
});

Handlebars.registerHelper('getCurrentBubble', function() {
  return Bubbles.findOne(Session.get('currentBubbleId'));
});

Handlebars.registerHelper('getCurrentPost', function() {
  return Posts.findOne(Session.get('currentPostId'));
});

Handlebars.registerHelper('isAdmin', function() {  
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  return (Meteor.user().userType == '3') || _.contains(bubble.users.admins, Meteor.userId());
});

Handlebars.registerHelper('belongsToBubble', function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  if(bubble) {
    if(_.contains(bubble.users.admins, Meteor.userId()) || _.contains(bubble.users.members, Meteor.userId())) {
      return true;
    }
  }
  return  Meteor.user().userType == '3' || false;
}); 



Handlebars.registerHelper('hasAppliedToBubble', function() {
    // var users = Bubbles.findOne(Session.get('currentBubbleId')).users;
    return _.contains(this.users.applicants, Meteor.userId());
});

Handlebars.registerHelper('isInvitedToBubble', function() {
    // var users = Bubbles.findOne(Session.get('currentBubbleId')).users;
    if (this.users)
      return _.contains(this.users.invitees, Meteor.userId());
    else
      return -1;
});

Handlebars.registerHelper('ownsPost', function() {
 var bubble = Bubbles.findOne(this.bubbleId);
  if(bubble) {
    userList = bubble.users.admins;
    userList.push(this.userId);
    return (Meteor.user().userType == '3') || _.contains(userList, Meteor.userId())
  }   
});

Handlebars.registerHelper('submittedText', function(submitted){
  return moment(new Date(submitted).toString()).fromNow().toUpperCase();
});

Handlebars.registerHelper('timestampToMonthShort', function(dateTime){
  return moment(new Date(dateTime).toString()).format('MMM');
});

Handlebars.registerHelper('timestampToDayLong', function(dateTime){
  return moment(new Date(dateTime).toString()).format('DD');
});

Handlebars.registerHelper('timestampToTime', function(dateTime){
  return moment(new Date(dateTime).toString()).format('h:mma');
});

Handlebars.registerHelper('timestampToFromNow', function(dateTime){
  return moment(new Date(dateTime).toString()).fromNow();
});

Handlebars.registerHelper('numOfAttendees', function(){
  if(typeof this.attendees != 'undefined'){
    return this.attendees.length;
  }
  else{
    return -1;
  }
});

Handlebars.registerHelper('numOfMembers', function(){
  if(typeof this.users != 'undefined'){
    return (this.users.members.length + this.users.admins.length);
  }
  else{
    return -1;
  }
});

Handlebars.registerHelper('toUpperCase', function(text){
  if(text) {
    return text.toUpperCase();
  }
});

Handlebars.registerHelper('getUsername', function(userId) {
  var user = Meteor.users.findOne({_id:userId.toString()});
  if(user) {
    return user.username;
  }
});

Handlebars.registerHelper('chosen', function() {
  //Checks if user has clicked on username to activate options
  if(Session.get(Session.get('currentBubbleId')+this.toString()) == this.toString()){
    return true;
  }
});

//Return errors
Handlebars.registerHelper('hasNoErrors', function() {
  if(Errors.find().count() == 0){
    return true;
  }else{
    return false;
  }
});

Handlebars.registerHelper('getBubbleUsersCount',function() {
  var bubble = Bubbles.findOne(Session.get("currentBubbleId"));

  var users = bubble.users.admins.concat(bubble.users.members);
  return users.length;
});

Handlebars.registerHelper('getLongCategory', function() {
    var currentCat = this.category;
    var category =  _.find(categories, function(cat) {
      return currentCat == cat.name_short;
    });
    if(category) {
      return category.name_long;
    }
});

Handlebars.registerHelper('convertSpacesToDashes',function(word) {
  return word.replace(" ","-");
});

Handlebars.registerHelper('decodeURI',function(uri) {
  return decodeURI(uri);
});

Handlebars.registerHelper('getTextAfterSlash',function(inputText) {
  if (inputText) {
    var textAfterSlash = inputText.split('/');
    return textAfterSlash[1];
  } else {
    return false;
  }
});

Handlebars.registerHelper('isLoggedIn', function() {
  if(Meteor.user()) {
    return true;
  }
});

Handlebars.registerHelper('hasBubble', function() {
  if(Bubbles.find({$or: [{'users.members': Meteor.userId()}, {'users.admins': Meteor.userId()}]}).count() > 0){
    return true;
  }else{
    return false;
  }
});

Handlebars.registerHelper('isUser', function(userId) {
  return (userId.toString() == Meteor.userId());
});

Handlebars.registerHelper('hasSearchText', function() {
  if(Session.get('searchText') != undefined){
    return true;
  }
});

//Checks if user is lvl 2
Handlebars.registerHelper('hasLevel2Permissions', function() {
  return (Meteor.user() && Meteor.user().userType == '2');
});

//Checks if user is lvl 2 or 3
Handlebars.registerHelper('hasLevel2And3Permissions', function() {
  return (Meteor.user() && (Meteor.user().userType == '2' || Meteor.user().userType == '3'));
});

//Checks if user is lvl 3
Handlebars.registerHelper('hasLevel3Permissions', function() {
  return (Meteor.user() && Meteor.user().userType == '3');
});

//Checks if user is allowed to edit post
Handlebars.registerHelper('hasEditPermissions', function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  if('super' == bubble.bubbleType) {
    if('2' == Meteor.user().userType || '3' == Meteor.user().userType) {
      return true;
    }
  }else{
    var post = Posts.findOne(Session.get('currentPostId'));
    if(_.contains(bubble.users.admins, Meteor.userId()) || Meteor.userId() == post.userId) {
      return true;
    }
  }
  return false
});

Handlebars.registerHelper('isSuperBubble', function() {
  return 'super' == Bubbles.findOne(Session.get('currentBubbleId')).bubbleType;
});
