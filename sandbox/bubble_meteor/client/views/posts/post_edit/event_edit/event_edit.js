Template.eventEdit.helpers({
  getDate: function(){
    return moment(this.dateTime).format("M/DD/YYYY");
  },
  getTime: function(){
    return moment(this.dateTime).format("hh:mm a");
  }

});

Template.eventEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = Session.get('currentPostId');
    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    
    var postProperties = {
      name: $(e.target).find('[name=name]').val(),
      body: $(e.target).find('[name=body]').val(),
      dateTime: moment(dateTime).valueOf(),
      location: $(e.target).find('[name=location]').val(),
      lastUpdated: new Date().getTime()
    }
    
    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('postPage', currentPostId);
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      Posts.remove(currentPostId);
      Meteor.Router.to('bubblePage',Session.get('currentBubbleId'));
    }
  }
});

Template.eventEdit.rendered = function() {
  $(".date-picker").glDatePicker(
    {
      cssName: 'flatwhite',
      selectedDate: new Date($(".date-picker").val())
    }
  );

  //Format the time when the textbox is changed
  $(".input-small").change(function(){
    var time = $(".input-small").val();
    if (time) {
      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $(".input-small").val("");
        $(".input-small").attr("placeholder","Time (ex: 9am)");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        $(".input-small").val(formatedTime);
      }

    }
  });

}
