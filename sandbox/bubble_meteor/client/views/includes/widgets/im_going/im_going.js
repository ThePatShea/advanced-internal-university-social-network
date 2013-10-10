Template.imGoing.created = function(){

  if(typeof goingDep === "undefined")
    goingDep = new Deps.Dependency;
}

Template.imGoing.helpers({
    mainWords : function() {
      goingDep.depend();
      console.log(">im-going", this);
      if (_.contains(this.attendees,Meteor.userId()))
        return "not going"
      else
        return "i'm going"
    }
});

Template.imGoing.events({
    'click .im-going': function(event) {
      // Disable the parent button
        event.stopPropagation();

      // Add/remove the user to/from list of attendees
      console.log("CLICK IM GOING: ", this);
      if(typeof this.id !== "undefined")
        Meteor.call('attendEvent',this,function(err,res){
          if(!err)
          {
            var section = window.location.pathname.split("/")[1];
            if(section === "explore")
            {
              console.log("Toggle Going");
              es.toggleGoing(res,Meteor.userId(),function(){
                console.log("Toggle Callback");
                explorePageDep.changed();
              });
            }
            if(section === "mybubbles")
            {
              console.log("Toggle Going");
              mybubbles.Events.toggleGoing(res,Meteor.userId(),function(){
                console.log("Toggle Callback");
                bubbleDep.changed();
              });
            }
          }
        });
      /*if(typeof this._id !== "undefined")
        Meteor.call('attendEvent',this._id,Meteor.userId(),function(err,res){
          if(!err)
          {
            var section = window.location.pathname.split("/")[1];
            if(section === "explore")
            {
              //exploreStuff
            }
            if(section === "mybubbles")
            {
              mybubbles.Events.toggleGoing(res,Meteor.userId());
            }
          }
        });*/

      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'Post', 'Attending Event', this.name]);
    }
});


Template.imGoingSmall.helpers({
    mainWords : function() {
      console.log(">im-going", this);
      if (_.contains(this.attendees,Meteor.userId()))
        return "not going"
      else
        return "i'm going"
    }
});

Template.imGoingSmall.events({
    'click .im-going': function(event) {
      // Disable the parent button
        event.stopPropagation();

      // Add/remove the user to/from list of attendees
      if(typeof this.id !== "undefined")
        Meteor.call('attendEvent',this.id,Meteor.userId(),function(err,res){
          if(!err)
          {
            var section = window.location.pathname.split("/")[1];
            if(section === "explore")
            {
              //exploreStuff
            }
            if(section === "mybubbles")
            {
              mybubbles.Events.toggleGoing(res,Meteor.userId());
            }
          }
        });
      /*if(typeof this._id !== "undefined")
        Meteor.call('attendEvent',this._id,Meteor.userId(),function(err,res){
          if(!err)
          {
            var section = window.location.pathname.split("/")[1];
            if(section === "explore")
            {
              //exploreStuff
            }
            if(section === "mybubbles")
            {
              mybubbles.Events.toggleGoing(res,Meteor.userId());
            }
          }
        });*/

      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'Post', 'Attending Event', this.name]);
    }
});
