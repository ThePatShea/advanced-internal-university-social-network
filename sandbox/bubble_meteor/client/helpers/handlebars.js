Handlebars.registerHelper('pluralize', function(n, thing) {
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

//Checks if user is allowed to edit post
Handlebars.registerHelper('hasEditPermissions', function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  if('super' == bubble.bubbleType) {
    if('superuser' == Meteor.user().userType) {
      return true;
    }
  }else{
    var post = Posts.findOne(Session.get('currentPostId'));
    if(_.contains(bubble.users.admins, Meteor.userId()) || Meteor.userId() == post.userId) {
      return true;
    }
  }
  return false
})

Handlebars.registerHelper('isSuperBubble', function() {
  if('super' == Bubbles.findOne(Session.get('currentBubbleId')).bubbleType) {
    return true;
  }
});