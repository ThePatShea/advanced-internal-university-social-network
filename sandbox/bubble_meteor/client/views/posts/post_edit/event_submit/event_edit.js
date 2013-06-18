Template.eventEdit.helpers({
  getDate: function(){
    return moment(this.submitted).format("M/DD/YYYY");
  },
  getTime: function(){
    return moment(this.submitted).format("hh:mm a");
  }

});

Template.eventEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = Session.get('currentPostId');
    
    var postProperties = {
      name: $(e.target).find('[name=name]').val(),
      body: $(e.target).find('[name=body]').val(),
      dateTime: $(e.target).find('[name=dateTime]').val(),
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
  $(".date-picker").glDatePicker({cssName: 'flatwhite'});

  //Format the time when the textbox is changed
  $(".input-small").change(function(){
    var time = $(".input-small").val();
    if (time) {

      var firstAlphabet  = parseInt(time[0]);

      if (time.length > 9 || (!firstAlphabet)){
        $(".input-small").val("Time (ex: 9am)");
      }else{
        formatedTime = moment(time,"h:mm a").format("h:mm a");
        $(".input-small").val(formatedTime);
      }

    }
  });

}
