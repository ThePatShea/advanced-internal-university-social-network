Handlebars.registerHelper('pluralize', function(n, thing) {
  // fairly stupid pluralizer
  if (n === 1) {
    return '1 ' + thing;
  } else {
    return n + ' ' + thing + 's';
  }
});

Handlebars.registerHelper('getCurrentBubble', function() {
  return Bubbles.findOne(Session.get('currentBubbleId'));
});

Handlebars.registerHelper('getBubbles', function() {
  return Bubbles.find({}, {sort: {submitted: -1}, limit: mainBubblesHandle.limit()});
});

Handlebars.registerHelper('getCurrentPost', function() {
  return Posts.findOne(Session.get('currentPostId'));
});

Handlebars.registerHelper('getPosts', function() {
  return Posts.find();
});

Handlebars.registerHelper('isAdmin', function() {  
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  return _.contains(bubble.users.admins, Meteor.userId());
});

Handlebars.registerHelper('submittedText', function(submitted){
  return moment(new Date(submitted).toString()).fromNow().toUpperCase();
});

Handlebars.registerHelper('toUpperCase', function(text){
  return text.toUpperCase();
});

Handlebars.registerHelper('getAllUsers', function(){
  return Users.find();
});

Handlebars.registerHelper('isLoggedIn',function() {
  return Meteor.userId();
});

Handlebars.registerHelper('getUsername', function(userId) {
  var user = Meteor.users.findOne({_id:userId.toString()});
  if(user) {
    return user.username;
  }
});

