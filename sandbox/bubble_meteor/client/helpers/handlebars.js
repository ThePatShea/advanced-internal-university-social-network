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
  return Bubbles.find();
});

Handlebars.registerHelper('getCurrentPost', function() {
  return Posts.findOne(Session.get('currentPostId'));
});

Handlebars.registerHelper('getPosts', function() {
  return Posts.find();
});

Handlebars.registerHelper('ownBubble', function() {
  if(Meteor.user()){
    var user = Meteor.users.findOne({_id: Meteor.user()._id});
    if(user.username == "admin"){
      return true;
    }else{
      return this.userId == Meteor.userId();
    }
  }
});

Handlebars.registerHelper('submittedText', function(submitted){
  return moment(new Date(submitted).toString()).fromNow().toUpperCase();
});

Handlebars.registerHelper('toUpperCase', function(text){
  return text.toUpperCase();
});





