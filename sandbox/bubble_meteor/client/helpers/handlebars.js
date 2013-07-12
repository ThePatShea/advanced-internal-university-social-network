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
        posts      : function() { return getPosts('file'); }
      , postType   : 'file'
      , word1      : 'latest'
    }
});

Handlebars.registerHelper('matchPostType', function(inputPostType) {
  return this.postType == inputPostType;
});

Handlebars.registerHelper('getCurrentBubble', function() {
  return Bubbles.findOne(Session.get('currentBubbleId'));
});

Handlebars.registerHelper('getCurrentPost', function() {
  return Posts.findOne(Session.get('currentPostId'));
});

Handlebars.registerHelper('isAdmin', function() {  
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  return (Meteor.user().userType == 'superuser') || _.contains(bubble.users.admins, Meteor.userId());
});

Handlebars.registerHelper('belongsToBubble', function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  if(bubble) {
    if(_.contains(bubble.users.admins, Meteor.userId()) || _.contains(bubble.users.members, Meteor.userId())) {
      return true;
    }
  }
  return  Meteor.user().userType == 'superuser' || false;
}); 

Handlebars.registerHelper('ownsPost', function() {
 var bubble = Bubbles.findOne(this.bubbleId);
  if(bubble) {
    userList = bubble.users.admins;
    userList.push(this.userId);
    return (Meteor.user().userType == 'superuser') || _.contains(userList, Meteor.userId())
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
  return this.attendees.length;
});

Handlebars.registerHelper('toUpperCase', function(text){
  return text.toUpperCase();
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


//Checks if bubble is a super bubble and if user is a super user
Handlebars.registerHelper('hasSuperPermissions', function() {
  if('superuser' != Meteor.user().userType && 'super' == Bubbles.findOne(Session.get('currentBubbleId')).bubbleType) {
    return false;
  }
  return true;
})

Handlebars.registerHelper('isSuperBubble', function() {
  if('super' == Bubbles.findOne(Session.get('currentBubbleId')).bubbleType) {
    return true;
  }
});
